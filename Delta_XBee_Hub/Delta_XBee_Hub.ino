#include <Arduino.h>
#include "SPI.h"
#include <Ethernet.h>

#define BROADCAST

static byte MAC[] = { 0x24, 0xAA, 0x02, 0x5E, 0x48, 0x70 };
char server[] = "deltalumin.herokuapp.com";

int BAUDRATE = 9600; // the baud rate we talk to the xbee
int CURRENTSENSE = 4; // which XBee ADC has current draw data
int VOLTSENSE = 0; // which XBee ADC has mains voltage data
float MAINSVPP = 170.0 * 2.0; // +-170V is what 120Vrms ends up being (= 120*2sqrt(2))
float VREF = 492.0; // approx ((2.4v * (10Ko/14.7Ko)) / 3
float CURRENTNORM = 15.5; // conversion to amperes from ADC

int voltageRawData[18] = {0}; // raw digital voltage values 0-1023
float voltageData[18] = {0}; // equalized voltage values
int currentRawData[18] = {0}; // raw digital current values 0-1023
float currentData[18] = {0}; // equalized current values
float powerData[18] = {0}; // calculated power values

byte join[2] = {0,0}; // used for piecing together 2 byte values
int numOfBytes = 0; // number of bytes in the packet
int sourceAddr = 0; // source address of transmitter
int numOfSamples = 0; // number of samples on dio/adc pins
float avgv = 0; // average voltage
float avgc = 0; // average current
float avgp = 0; // average power
float vpp = 0; // peak to peak voltage
 
byte adcStatus = 0x0; // analog pin status
float adcVal[6] = {0,0,0,0,0,0}; // analog pin values
 
byte dioStatus = 0x0; // digital pin status
byte dioVal = 0x0; // digital pin values

// map up to 10 transmitter addresses to 0-9 for easier indexing
// this way, the same index can be used across data arrays, and
// the source address just needs to be looked up in the addrMap
// array
int addrMap[10] = {-1,-1,-1,-1,-1,-1,-1,-1,-1,-1}; // initialize to -1 so that we know what's not indexed
int currIndex = -1;
// arrays to hold data from 10 devices
long lastTimeArray[10] = {0.0}; // array with last read times
long timerArray[10] = {0.0}; // 5 min timer
long elapsedSecondsArray[10] = {0.0};
float wattHrArray[10] = {0.0}; // cumulative watts/hr

// declare a client for uploading to the server
EthernetClient client;

void setup() {
  Serial.begin(9600); // Terminal serial output
  Serial3.begin(9600); // XBee serial communication
  // reset time for all last times
  for (int i=0; i<(sizeof(addrMap)/sizeof(addrMap[0])); i++) {
    lastTimeArray[i] = millis(); // get the current time
    timerArray[i] = lastTimeArray[i];
  }
  
  // start the Ethernet connection:
  Ethernet.begin(MAC);
}

void loop() {
  // reset data pulled from XBee packet
  numOfBytes = 0;
  sourceAddr = 0;
  numOfSamples = 0;
  currIndex = -1;
 
  // reset analog pin status and values
  adcStatus = 0x0;
  for(int i = 0; i < 6; i++)
    adcVal[i] = 0;
  
  // reset digital pin status
  dioStatus = 0x0;
  
  if(Serial3.available() >= 28) // Check for at least one complete frame
  {
     if(Serial3.read() == 0x7E) // Start at beginning of frame
     {
       //Serial.print("Start Byte: 0x7E");
 
//-------------- Number of Bytes in Frame ---------//       
 
       //Serial.print("\nNr Of Bytes: ");
       join[0] = Serial3.read();
       //Serial.print(join[0], HEX); // MSB length
       //Serial.print(" ");
       join[1] = Serial3.read();
       //Serial.print(join[1], HEX); // LSB length
       numOfBytes = join[1] + (join[0] << 8);
       //Serial.print(" --> DEC Value: ");
       //Serial.println(numOfBytes);      
 
//-------------- Source Address Checking ---------//       
 
       //Serial.print("\nAddress Mode: ");
       Serial3.read();
       //Serial.print(Serial3.read(), HEX); // 83 = 16bit address
       Serial.print("\nSource Address: ");
       join[0] = Serial3.read();
       //Serial.print(join[0], HEX); // MSB Address
       //Serial.print(" ");
       join[1] = Serial3.read();
       //Serial.print(join[1], HEX); // LSB Address
       sourceAddr = join[1] + (join[0] << 8); 
       Serial.println(sourceAddr);
       
       // check if source address is already indexed, if not index it
       for (int i=0; i<(sizeof(addrMap)/sizeof(addrMap[0])); i++) {
         if (addrMap[i] == sourceAddr) {
           currIndex = i;
           break;
         } else if (addrMap[i] == -1) {
           addrMap[i] = sourceAddr;
           currIndex = i;
           break;
         }
       }
 
//-------------- RSSI Checking ---------//  
 
       //Serial.print("\nRSSI (signal strength in -dBm): ");
       //Serial.print(Serial3.read(), DEC); 
       Serial3.read();
 
//-------------- Number of Samples in Frame ---------//   
 
       //Serial.print("\nNr of Samples: ");
       join[0] = Serial3.read();
       //Serial.print(join[0], HEX); // MSB samples
       //Serial.print(" ");
       join[1] = Serial3.read();
       //Serial.print(join[1], HEX); // LSB samples
       numOfSamples = join[1] + (join[0] << 8);
       //Serial.print(" --> DEC Value: ");
       //Serial.print(numOfSamples);       
 
//-------------- Channel Indicator  ---------//
 
       //Serial.print("\nChannel Bitfield: ");
       adcStatus = Serial3.read();
       //Serial.print(adcStatus, BIN); // Neglecting D8
       //Serial.print(" ");
       dioStatus = Serial3.read();
       //Serial.print(dioStatus, BIN);
       
//-------------- Read-in ADC Values ---------//
      if(adcStatus > 0x0)
      {
        // reset arrays
        memset(voltageRawData, 0, sizeof(voltageRawData));
        memset(voltageData, 0, sizeof(voltageRawData));
        memset(currentRawData, 0, sizeof(currentRawData));
        memset(currentData, 0, sizeof(currentRawData));
        memset(powerData, 0, sizeof(currentRawData));
        
        // reset averages
        avgv = 0;
        avgc = 0;
        avgp = 0;
        
        // read in ADC values
        // skip first one since it's usually wrong
        for (int i = 1; i < numOfSamples; i++) {
          while(Serial3.available() < 1);
          join[0] = Serial3.read();
          while(Serial3.available() < 1);
          join[1] = Serial3.read();             
          voltageRawData[i-1] = join[1] + (join[0] << 8);
          
          while(Serial3.available() < 1);
          join[0] = Serial3.read();
          while(Serial3.available() < 1);
          join[1] = Serial3.read();             
          currentRawData[i-1] = join[1] + (join[0] << 8);
        }
        
        int min_v = 1024; // XBee ADC is 10 bits, so max value is 1023
        int max_v = 0;
        // find min and max voltage values from current samples
        for (int i = 0; i < (numOfSamples-1); i++) {
            if (min_v > voltageRawData[i])
                min_v = voltageRawData[i];
            if (max_v < voltageRawData[i])
                max_v = voltageRawData[i];
        }
        
        // figure out the 'average' of the max and min readings
        avgv = (float)(max_v + min_v) / 2.0;
        // also calculate the peak to peak measurements
        vpp =  max_v-min_v;

        // normalize current readings to amperes
        for(int i = 0; i < (numOfSamples-1); i++) {
            // remove 'dc bias', which we call the average read
            voltageData[i] = (float)voltageRawData[i] - avgv;
            // We know that the mains voltage is 120Vrms = +-170Vpp
            voltageData[i] = (voltageData[i] * MAINSVPP) / vpp;
            
            // VREF is the hardcoded 'DC bias' value, its
            // about 492 but would be nice if we could somehow
            // get this data once in a while maybe using xbeeAPI
            currentData[i] = (float)currentRawData[i] - VREF;
            // the CURRENTNORM is our normalizing constant
            // that converts the ADC reading to Amperes
            currentData[i] /= CURRENTNORM;
            
            // calculate power consumed
            powerData[i] = voltageData[i] * currentData[i];
        }
        
        // 16.6 samples per second, one cycle = ~17 samples
        for(int i = 0; i < 17; i++)
            avgc += abs(currentData[i]);
        avgc /= 17.0;

        // 16.6 samples per second, one cycle = ~17 samples
        for(int i = 0; i < 17; i++)      
            avgp += abs(powerData[i]);
        avgp /= 17.0;

        // add up the delta-watthr used since last reading
        // Figure out how many watt hours were used since last reading
        for (int i=0; i<(sizeof(addrMap)/sizeof(addrMap[0])); i++) {
          if (i == currIndex) {
            elapsedSecondsArray[i] = (millis() - lastTimeArray[i]) / 1000; // 1000 ms in 1 s
            float dwatthr = (avgp * elapsedSecondsArray[i]) / (60.0 * 60.0); // 60 s in 60 min = 1 hr
            lastTimeArray[i] = millis();
            Serial.print("Wh used in last ");
            Serial.print(elapsedSecondsArray[i]);
            Serial.print(" seconds: ");
            Serial.println(dwatthr);
            
            wattHrArray[i] += dwatthr;
    
            // check if it's been five minutes since our last save
            if ((millis() - timerArray[i]) >= 300000) {
              // Print out debug data, Wh used in last 5 minutes
              float avgwattsused = wattHrArray[i] * (60.0*60.0 / ((millis() - timerArray[i])/1000));
              float avgkwattsused = avgwattsused/1000; // convert to killawatts
              Serial.print(wattHrArray[i]);
              Serial.print("Wh = ");
              Serial.print(avgkwattsused);
              Serial.println("kW average");
    
              // connect to heroku and POST data
              if (client.connect(server, 80)) {
                Serial.println("connected");
                client.println("POST / HTTP/1.1");
                client.println("Host: deltalumin.herokuapp.com");
                client.println("Connection: close");
                client.println("User-Agent: Arduino");
                client.println("Content-Type: application/x-www-form-urlencoded");
                char outBuf[64];
                char thisData[64];
                int d1 = (int)wattHrArray[i];
                int d2 = 10000 * (wattHrArray[i] - d1);
                // POST data as {tx address, watt/hr int, watt/hr frac}
                sprintf(thisData,"name=%d&power=%d&fraction=%d\r\n",sourceAddr, d1, d2);
                sprintf(outBuf,"Content-Length: %u\r\n",strlen(thisData));
                client.println(outBuf);
                client.println(thisData);
                client.println();
                Serial.println("sent.");
                client.stop();
              } else // we couldn't connect
                Serial.println("Failed to Connect");
              
              // reset our 5 minute timer
              timerArray[i] = millis();
              // reset power consumed array
              wattHrArray[i] = 0;
            }
          }
        }
      }
     }
     // flush the XBee buffer
     Serial3.flush(); 
  }
}
