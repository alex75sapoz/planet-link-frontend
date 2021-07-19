## _**Development Certificate Guide**_
---
## _**How to add a new subdomain**_

- **certificate.conf**
    1. Enter a new dns record after _**[alt_names]**_
    2. Example
    
           DNS.1 = local-planet-link.com

    3. Proceed to create a new certificate

---
## _**How to create a new certificate**_

- **Windows**
    1. Open command prompt and change directory to this project
    2. Execute
    
           cd development/certificate

    3. Execute

           openssl req -x509 -newkey rsa:4096 -sha256 -keyout certificate.key -out certificate.crt -days 365 -config certificate.conf -new -nodes
           
    4. Execute

           openssl pkcs12 -export -out certificate.pfx -inkey certificate.key -in certificate.crt

    5. Proceed to import a new certificate

---
## _**How to import a new certificate**_

- **Frontend**
    - **Windows**
       1. Open _**Manage Computer Certificates**_ from the start menu
       2. Expand _**Trusted Root Ceritification Authorities**_
       3. Right click on _**Certificates**_ and select _**All Tasks -> Import**_
       4. Click next and navigate to _**development/certificates**_
       5. Click on _**certificate.pfx**_
              - Note: You might need to change the allowed file types for it to be selectable
       6. Finish the last steps
- **Backend**
    - **Windows**
       1. Open _**IIS**_
       2. Open _**Server Certificates**_
       3. Click on _**Import**_
       4. Navigate to _**development/certificates**_
       5. Click on _**certificate.pfx**_
       6. Finish the last steps