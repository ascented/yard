const int VRxPin = A0;
const int VRyPin = A1;
const int switchPin = 5;

int VRx = 0;
int VRy = 0;
int switchMode = 0;


/* 
    Флаги vrx, vry и sw перед значениями используются
    для определения отношения значения во внешних скриптах
    или программах.
*/
void output(int VRx, int VRy, int switchMode) {
    Serial.print("vrx");
    Serial.println(VRx);
    Serial.print("vry");
    Serial.println(VRy);
    Serial.print("sw");
    Serial.println(switchMode);
}

void setup() {
    Serial.begin(9600);
    pinMode(VRxPin, INPUT);
    pinMode(VRyPin, INPUT);
    pinMode(switchPin, INPUT_PULLUP);
}

void loop() {
    VRx = analogRead(VRxPin);
    VRy = analogRead(VRyPin);
    switchMode = digitalRead(switchPin);
    output(VRx, VRy, switchMode);
}