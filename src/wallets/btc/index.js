'use strict';

const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const {BIP32Factory} = require('bip32');
const {ECPairFactory} = require('ecpair');
const ecc = require('tiny-secp256k1');

const libConfig = require('../config');
const btcConfig = require('./btc.json');

const bip32Factory = BIP32Factory(ecc);
const ecPairFactory = ECPairFactory(ecc);

function getNetwork() {
  return bitcoin.networks[libConfig.network];
}

function getAddressType(address) {
  const addressTypes = btcConfig.address_types[libConfig.network];
  return Object.keys(addressTypes).find((addressTypeKey) => addressTypes[addressTypeKey].prefixes.some((prefix) => address.startsWith(prefix)));
}

function getAddressTypeConfig(address) {
  const addressTypes = btcConfig.address_types[NETWORK_NAME];
  return Object.values(addressTypes).find((addressType) => addressType.prefixes.some((prefix) => address.startsWith(prefix)));
}

function getDerivationPath(scriptPubKeyType = 'p2wpkh') {
  return btcConfig.address_types[libConfig.network][scriptPubKeyType].derivationPath;
}

function getScriptPubKey(network, publicKey, scriptPubKeyType = 'p2wpkh') {
  return bitcoin.payments[scriptPubKeyType]({
    network,
    pubkey: publicKey,
  });
}

function validateInputSignature(publicKey, msgHash, signature) {
  return ecPairFactory.fromPublicKey(publicKey).verify(msgHash, signature);
}

async function getWalletDetails(mnemonic, scriptPubKeyType) {
  const network = getNetwork();
  const seed = await bip39.mnemonicToSeed(mnemonic);
  const root = bip32Factory.fromSeed(seed, network);
  const node = root.derivePath(getDerivationPath(scriptPubKeyType));
  const {address} = getScriptPubKey(network, node.publicKey, scriptPubKeyType);
  return {
    address,
    mnemonic,
    seed: seed.toString('hex'),
    public_key: node.publicKey.toString('hex'),
    private_key: node.toWIF(),
    address_type: getAddressType(address),
  };
}

exports.createWallet = (scriptPubKeyType) => {
  const mnemonic = bip39.generateMnemonic();
  return getWalletDetails(mnemonic, scriptPubKeyType);
};

exports.importWallet = (mnemonic, scriptPubKeyType) => {
  const valid = bip39.validateMnemonic(mnemonic);
  if (!valid) {
    throw new Error('Invalid recovery phrase');
  }
  return getWalletDetails(mnemonic, scriptPubKeyType);
};

exports.createTransaction = async (privateKey, inputs, outputs) => {
  const network = getNetwork();
  const keyPair = ecPairFactory.fromWIF(privateKey, network);

  const psbt = new bitcoin.Psbt({network: network});

  await Promise.all(inputs.map(async (input) => {
    const psbtInput = {
      hash: input.hash,
      index: input.vout,
    };
    if (input.witness) {
      psbtInput.witnessUtxo = {
        script: getScriptPubKey(keyPair.publicKey).output,
        value: input.value,
      };
    } else {
      psbtInput.nonWitnessUtxo = Buffer.from(input.raw, 'hex');
    }
    psbt.addInput(psbtInput);
  }));

  outputs.forEach((output) => {
    psbt.addOutput(output);
  });

  psbt.signAllInputs(keyPair);
  if (!psbt.validateSignaturesOfAllInputs(validateInputSignature)) {
    throw new Error('Invalid signature');
  }
  psbt.finalizeAllInputs();

  const tx = psbt.extractTransaction();
  return tx;
};
