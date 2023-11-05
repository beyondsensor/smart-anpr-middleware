# Smart ANPR Middleware

This is a service designed to manage and integrate different components. This includes:

1. **IO Controller** : Provide Trigger to IO Controller, so that Strobe Lights, Speakers, etc can be triggered via dry contact. This is done so using MQ 
2. **CCTV Sensors** : Listen to ANPR Detections, so that when a License Plate is detected, and stopped within the given zone, it will be triggereD
