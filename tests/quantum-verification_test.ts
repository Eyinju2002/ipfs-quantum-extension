import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.5.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.170.0/testing/asserts.ts';

Clarinet.test({
    name: "Test apply as quantum auditor",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const testAuditor = accounts.get('wallet_1')!;

        const block = chain.mineBlock([
            Tx.contractCall('quantum-verification', 'apply-as-auditor', [
                types.ascii('Quantum Research Labs'),
                types.ascii('Quantum Innovations'),
                types.ascii('https://quantum.research'),
                types.ascii('Quantum Certification Credentials')
            ], testAuditor.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result, '(ok true)');
    }
});

Clarinet.test({
    name: "Test quantum contract verification",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        const testContract = accounts.get('wallet_1')!;

        const block = chain.mineBlock([
            Tx.contractCall('quantum-verification', 'verify-contract', [
                types.principal(testContract.address),
                types.ascii('1.0.0')
            ], deployer.address)
        ]);

        assertEquals(block.receipts.length, 1);
        assertEquals(block.receipts[0].result, '(ok false)');
    }
});