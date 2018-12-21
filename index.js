#!/usr/bin/env node

const program = require('commander')
const jsonld = require('jsonld')
const jsig = require('jsonld-signatures')
const clear = require('clear')
const figlet = require('figlet')
const chalk = require('chalk')
const fs = require('fs')

jsig.use('jsonld', jsonld);

var publicKeyUrl = 'did:v1:test:nym:nmR9EvCsQ8Jj-OTC7LD9Mb0q5mHqKj_4f75myaR3i5M#authn-key-1';

var publicKeyPem = 
  '-----BEGIN PUBLIC KEY-----\r\n' +
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyFrXjLpXVOh5jghxbtJs\r\n' +
  'Tu/LOTqshrb+Py7ULtN7uIdLzIyflQwExlyUO/dX8qOrK6k046m0aRuUPZVDvfoz\r\n' +
  'ako/BWsYyVXQgrv0pwLmULGOYg9aLXnbSq76sVsxOMz9BxXkVCWp74mIJOvmeclL\r\n' +
  '5bbY1Svks0u1DidaUU7yuavpS8LUXNzcEOEgJBLc9ZhsKKKLK3d0i2V0Vwk2+AYT\r\n' +
  'zF0Tkwq2/XCrpTevLEsKcyaUbzrEmtw5/221vS5vgLBASA2fvkak7VhHJpK0vBYK\r\n' +
  'gq8X+bY+xJX9Nkh2k4cIS74XgypcP6fDe8cvXskB3IHCMy3I3BJc7BkGbPJwlzUZ\r\n' +
  '3QIDAQAB\r\n' +
  '-----END PUBLIC KEY-----\r\n';

var privateKeyPem = 
  '-----BEGIN RSA PRIVATE KEY-----\r\n' +
  'MIIEowIBAAKCAQEAyFrXjLpXVOh5jghxbtJsTu/LOTqshrb+Py7ULtN7uIdLzIyf\r\n' +
  'lQwExlyUO/dX8qOrK6k046m0aRuUPZVDvfozako/BWsYyVXQgrv0pwLmULGOYg9a\r\n' +
  'LXnbSq76sVsxOMz9BxXkVCWp74mIJOvmeclL5bbY1Svks0u1DidaUU7yuavpS8LU\r\n' +
  'XNzcEOEgJBLc9ZhsKKKLK3d0i2V0Vwk2+AYTzF0Tkwq2/XCrpTevLEsKcyaUbzrE\r\n' +
  'mtw5/221vS5vgLBASA2fvkak7VhHJpK0vBYKgq8X+bY+xJX9Nkh2k4cIS74Xgypc\r\n' +
  'P6fDe8cvXskB3IHCMy3I3BJc7BkGbPJwlzUZ3QIDAQABAoIBAGY30pj9yOiM4tdP\r\n' +
  '/29m89MiDDDaeoMQgY6CucZaJ1jxzf5CEHjedOEvAoHFo50rW30fCtjMEDs/0tXI\r\n' +
  'fZNDP1APKS/+f9rYaVUJx7wdgpvQuq/U3VEuRm9H7qblu6sbCky/Ioq73INVS5xq\r\n' +
  'rl+cD5jXPLElf7zp9ymNckrhWHzZDS2ss7Jfw7OxmEUzKkgoF+oRswG0yFHcn6Rx\r\n' +
  'O0pVIGSnpHJsgNKuUOq3QtUXucSDAfAAwxdMX173WHtVOABT/PHs8RtSpbpan20H\r\n' +
  'FaLLx9c5C7XwaOmNnvkxImVaT2rh0P5UwejKw01zTHvoe7eOtCLBYipxYIibGj5F\r\n' +
  'b8QMZ4ECgYEA6Zt59GYR/RWmSQ2AYq95iRE8goax2GPmrKzlD+qvi5/WKVyy43z3\r\n' +
  'lP62IZwkv1G9F1damZwbVNpnjOYu4TJ4gY9k97bdK0HG7UGl2JZBPu3KhCr/PV4w\r\n' +
  'qTWh7RwbK+nl24MO1tz4WFkkuNrcVP0GVfYxw/DdvZDiScCa7RGlkSkCgYEA249g\r\n' +
  '2CGE96OhZ+VE6CIl3oL5ZXGoxpTKgXZgjGVSh5vpjT9e0ImTTqBRfUxTI2BnNB6v\r\n' +
  'PCz4xDoijcL0wAegKzajbUGaSNhe1fYl9NkqEUsUBlMb1X+U0xPaHR/bbJ64FBA7\r\n' +
  '3CLbLo5bFx9Xp1RUxorK61Epc7MU54nj8o8dVZUCgYAJL4znGFBixEQqoTZIKyA7\r\n' +
  'TIs1krhRivQaHB5Rtue6NMnGDJgYK+TMXgupXKtxPnSSA2RTn/jPKFtkBfUX89Ub\r\n' +
  'Oxk8SFuABPEeiTNNRfNA1zbcZZhtwFNng+1fFnjXDDZ2oDuoJT46sx6niiuZx+1E\r\n' +
  '2g5w5vrBJn5PahxtcAEzqQKBgEWmaDxn9bxxRiSlUISrQIQj3GXX9oh4bv0+xkYD\r\n' +
  'Znjqdt59+eABpJ9OsEslSUJxtIuOKFzYj1oAbzG1ZNr+EEtlG9bu9rihGwSY/1V7\r\n' +
  'BqNRw9p1xuClhlqnc4vFrV/5wb9rnvGohQtx0We2Y6ILWJFbOiAIMTQo3TrOPWeX\r\n' +
  'CuE5AoGBANYbw1M5D0D3nfrPjsojkFBsb5pFrN3rL5bhVUBG9Rh3vBxX5RZlIOaF\r\n' +
  'IT8o1j+NTaZIMo3A32vm2kdwTU4sZDGVDgFELhKOgfB5FBledw/MxMYt4QbuewuP\r\n' +
  'UScpFQzu5a8YmaASN5mOAfW7VXY+99fFCxsP/DG7KKK2Z1xhjqpI\r\n' +
  '-----END RSA PRIVATE KEY-----\r\n';

var publicKey = {
  '@context': "https://w3id.org/security/v2",
  id: publicKeyUrl,
  type: ['CryptographicKey', 'RsaVerificationKey2018'],
  owner: 'did:v1:test:nym:nmR9EvCsQ8Jj-OTC7LD9Mb0q5mHqKj_4f75myaR3i5M',
  publicKeyPem: publicKeyPem
};

var publicKeyOwner = {
  '@context': "https://w3id.org/security/v2",
  id: 'did:v1:test:nym:nmR9EvCsQ8Jj-OTC7LD9Mb0q5mHqKj_4f75myaR3i5M',
  publicKey: [publicKey],
  "https://example.org/special-authentication": {
    publicKey: publicKeyUrl
  }
};

program
	.version('1.0.0' , '-v, --version')
	.description('Digitally sign and verify JSON-LD files')
	.option('-s --sign', 'Sign the JSON-LD file', false)
  	.option('-c --verify', 'Verify the signed file', false)
  	.option('-f --file <path>', 'File to be verified or signed')
  	.parse(process.argv);

if(program.sign && typeof program.sign !='undefined' && program.verify && typeof program.verify !='undefined'){
	console.log(
	  	chalk.red(
	  		figlet.textSync('ERROR:', {horizontalLayout : 'fitted' })
	  	)
	);
	console.log(
  		chalk.yellow(' -s and -c flag can not be passed together')
  	);
}else if(program.sign){
	let file = program.file;
	// create the JSON-LD document that should be signed
	if (fs.existsSync(program.file)) {
	    // Do something
	    let contents = fs.readFileSync(program.file, 'utf8');
		  let jsonContent = JSON.parse(contents); 

      if(isJson(jsonContent)){
		
    		// sign the document and then verify the signed document
    		jsig.sign(jsonContent, {
    		  algorithm: 'RsaSignature2018',
    		  creator: publicKeyUrl,
    		  privateKeyPem: privateKeyPem,
    		}, function(err, signedDocument) {

          fs.writeFileSync("sign-creddoc.json", JSON.stringify(signedDocument), 'utf8')
    		  console.log(JSON.stringify(signedDocument))
    		});
      }else {
        titleDisplay('INVALID JSON', false);
      }
		
	}else {
    titleDisplay('ERROR', false);
		console.log('file does not exist at', program.file);
	}
}else if(program.verify){
  if (fs.existsSync(program.file)) {
      // Do something
    let signedContent = fs.readFileSync(program.file, 'utf8');
    if(isJson(signedContent)){
      let signedDocument = JSON.parse(signedContent); 

      // verify the signed document
      jsig.verify(signedDocument, {
        publicKey: publicKey,
        publicKeyOwner: publicKeyOwner
      }, function(err, response) {
        if(err) {
          return console.log('Signature verification error:', err);
        }
        if(response.verified){
          titleDisplay('VERIFIED', true);
        }else {
          titleDisplay('NOT VERIFIED', false);
          console.log('Signature is valid:', response);
        }
      });
    } else {
      titleDisplay('INVALID JSON', false);
    }
    
  }else {
    titleDisplay('ERROR', false);
    console.log('file does not exist at', program.file);
  }
}


function isJson(item) {
    item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}

function titleDisplay(title, flag) {
  if(flag){
    console.log(
      chalk.green(
        figlet.textSync(title, {horizontalLayout : 'fitted' })
      )
    )
  }else {
    console.log(
      chalk.red(
        figlet.textSync(title, {horizontalLayout : 'fitted' })
      )
    )
  }
}


program.on('--help', function(){
  console.log('')
  console.log(
  	chalk.red(
  		figlet.textSync('Examples:', {horizontalLayout : 'fitted' })
  	)
  );
  console.log(
  	chalk.green('  $ cd-tool -s -f creddoc.json > sign-creddoc.json // Sign the creddoc.json file')
  );
  console.log(
  	chalk.green('  $ cd-tool -v -f sign-creddoc.json // Verify the signed doc')
  );
});