/*
    Create a signed club credential from an unsigned club credential
    and proof options.
*/

import { mkdir, readFile, writeFile } from 'fs/promises';
import jsonld from 'jsonld';
import { localLoader } from './documentLoader.js';
import { base58btc } from 'multiformats/bases/base58';
import {ed25519 as ed} from '@noble/curves/ed25519.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { concatBytes } from '@noble/hashes/utils.js';

// Use this object to set input file and output directory.
// const dirsAndFiles = {
const dirsAndFiles = {
  outputDir: './output/',
  inputFile: './windfoilEx.json',
  keyFile: './output/keys/allKeys.json'
}

// Create output directory for the results
const baseDir = dirsAndFiles.outputDir;
let status = await mkdir(baseDir, {recursive: true});

jsonld.documentLoader = localLoader; // Local loader for JSON-LD

// Read from keys file.
const keyPair = JSON.parse(
    await readFile(
      new URL(dirsAndFiles.keyFile, import.meta.url)
    )
  );

// Read input document from a file or just specify it right here.
let document = JSON.parse(
    await readFile(
      new URL(dirsAndFiles.inputFile, import.meta.url)
    )
  );

// Signed Document Creation Steps:

// Canonize the document
let cannon = await jsonld.canonize(document);
// Hash canonized document
let cannonBytes = new TextEncoder().encode(cannon);
let docHash = sha256(cannonBytes);

// Set proof config/options from file here.
let proofConfig = {};
proofConfig.type = 'DataIntegrityProof';
proofConfig.cryptosuite = 'eddsa-rdfc-2022';
//proofConfig.created = '2023-02-24T23:36:38Z';
proofConfig.verificationMethod = 'did:key:' + keyPair.publicKeyMultibase + '#' + keyPair.publicKeyMultibase;
proofConfig.proofPurpose = 'assertionMethod';

// Set proof options context per spec
proofConfig['@context'] = document['@context'];
// canonize the proof config
let proofCanon = await jsonld.canonize(proofConfig);
// Hash canonized proof config
let proofCanonBytes = new TextEncoder().encode(proofCanon);
let proofHash = sha256(proofCanonBytes);
// Combine hashes
let combinedHash = concatBytes(proofHash, docHash); // Hash order different from draft

// Sign
let privKey = base58btc.decode(keyPair.privateKeyMultibase);
privKey = privKey.slice(2, 34); // only want the first 2-34 bytes
let signature = await ed.sign(combinedHash, privKey);

// Construct Signed Document
let signedDocument = Object.assign({}, document);
delete proofConfig['@context'];
signedDocument.proof = proofConfig;
signedDocument.proof.proofValue = base58btc.encode(signature);
console.log(JSON.stringify(signedDocument, null, 2));
writeFile(baseDir + 'signedDataInt.json', JSON.stringify(signedDocument, null, 2));

