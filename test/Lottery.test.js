const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const {interface, bytecode} = require('../compile')

let lottery, accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts()

    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'})
})

describe('Lottery Contract', () => {

    it('deploys the contract', () => {
        assert.ok(lottery.options.address)
    })

    it('allows one account to enter', async () => {
        const firstAccount = accounts[0]

        await lottery.methods.enter().send({
            from: firstAccount,
            value: web3.utils.toWei('0.02', 'ether')
        })

        const players = await lottery.methods.getPlayers().call({from: firstAccount})

        assert.equal(firstAccount, players[0])
        assert.equal(1,players.length)
    })

})