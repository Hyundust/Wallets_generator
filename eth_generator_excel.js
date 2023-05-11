const HDKey = require('hdkey');
const { generateMnemonic } = require('bip39');
const XLSX = require('xlsx');

// Get number of wallets from command line arguments
const N = parseInt(process.argv[2]);

// Initialize Excel workbook and worksheet
const workbook = XLSX.utils.book_new();
const worksheet = XLSX.utils.json_to_sheet([{ Mnemonic: "Mnemonic", Address: "Address", "Private key": "Private key" }]);
try{
        // Loop N times to generate N wallets
        for (let i = 0; i < N; i++) {
        // Generate English mnemonic words
        const mnemonic = generateMnemonic(128);

        // Derive master private key from mnemonic
        const hdkey = HDKey.fromMasterSeed(Buffer.from(mnemonic, 'utf8'));

        // Derive Ethereum address and private key from master private key
        const address = `0x${hdkey.deriveChild("m/44'/60'/0'/0/0").publicKey.toString('hex', 2)}`;
        const privateKey = `0x${hdkey.deriveChild("m/44'/60'/0'/0/0").privateKey.toString('hex', 2)}`;

        // Write data to worksheet
        const row = { Mnemonic: mnemonic, Address: address, "Private key": privateKey };
        XLSX.utils.sheet_add_json(worksheet, [row], { skipHeader: true, origin: i + 1 });
        }
        // Add worksheet to workbook and save to file
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ethereum Wallets");
    XLSX.writeFile(workbook, "eth_wallets.xlsx");
    console.log(`Successfuly generated ${N} wallets and exported into excel file.`)
}catch(err){
    console.log(err);
}
