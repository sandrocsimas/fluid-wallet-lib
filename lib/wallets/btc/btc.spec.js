"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = __importDefault(require("../.."));
const _1 = __importDefault(require("."));
describe('btc', () => {
    before(() => {
        __1.default.config.network = 'regtest';
    });
    describe('#createWallet()', () => {
        it('should create a native segwit address by default', () => __awaiter(void 0, void 0, void 0, function* () {
            const wallet = yield new _1.default().createWallet();
            console.log(wallet);
        }));
    });
    describe('#importWallet()', () => {
        it('should import a native segwit address by default', () => __awaiter(void 0, void 0, void 0, function* () {
            const wallet = yield new _1.default().importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
            console.log(wallet);
        }));
    });
    // describe('#createTransaction()', () => {
    //   it('should create a transaction', async () => {
    //     const privateKey = 'cTuc3sRj3jhYMorfAj9TkyKYQ7BXQyUzqfHM9R4Yawhh1FpCtGgM';
    //     const inputs = [{
    //       hash: '26050469;cf1f;cd026f22ecbac67116d85e5f3d28bea4719c920b3167ba59c35c',
    //       vout: 0,
    //       value: 1250000000,
    //       raw: '020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff05029e010101ffffffff02807c814a000000001600143939a3ad9b00ccb9d1476725711746288c99eef70000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000',
    //     }];
    //     const outputs = [
    //       {
    //         address: 'mus1omSG8Dxy7KxEBZ1i21sH8juWKZJ8h9',
    //         value: 10000000,
    //       },
    //       {
    //         address: 'bcrt1q8yu68tvmqrxtn528vujhz96x9zxfnmhhn9j78x',
    //         value: 1239977400,
    //       },
    //     ];
    //     const transaction = await new BTCWallets().createTransaction(privateKey, inputs, outputs);
    //     console.log(transaction);
    //   });
    // });
});
