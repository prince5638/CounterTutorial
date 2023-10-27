import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { toNano } from 'ton-core';
import { CounterContract } from '../wrappers/CounterContract';
import '@ton-community/test-utils';
import { exec } from 'child_process';

describe('CounterContract', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counterContract: SandboxContract<CounterContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        counterContract = blockchain.openContract(await CounterContract.fromInit(56385638n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counterContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counterContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and counterContract are ready to use
    });

    it('should increment', async () => {
        const counterBefore = await counterContract.getCounter();
        console.log('counterBEfore: ', counterBefore);

        await counterContract.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            'increment'
        );

        const counterAfter = await counterContract.getCounter();
        console.log("counterAfter :", counterAfter);

        expect(counterBefore).toBeLessThan(counterAfter)
    });
});
