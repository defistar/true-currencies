import { expect } from 'chai'
import { Wallet } from 'ethers'
import { Zero } from 'ethers/constants'

import { beforeEachWithFixture } from '../utils/beforeEachWithFixture'

import { SlowTrueDistributor } from '../../build/types/SlowTrueDistributor'
import { SlowTrueDistributorFactory } from '../../build/types/SlowTrueDistributorFactory'

describe('SlowTrueDistributor', () => {
  let owner: Wallet
  let fakeToken: Wallet
  let distributor: SlowTrueDistributor

  beforeEachWithFixture(async (_provider, wallets) => {
    [owner, fakeToken] = wallets
    distributor = await new SlowTrueDistributorFactory(owner).deploy(0, fakeToken.address)
  })

  describe('reward', () => {
    it('from block 0 to last', async () => {
      expect(await distributor.reward(0, await distributor.getTotalBlocks())).to.equal('16094999999999999999999999999685042666623901690000')
    })

    it('sums to total TRU distributor (with step 1000000)', async () => {
      let sum = Zero
      const totalBlocks = (await distributor.getTotalBlocks()).toNumber()

      for (let i = 0; i < totalBlocks; i += 1000000) {
        const newReward = await distributor.reward(i, Math.min(i + 1000000, totalBlocks))
        sum = sum.add(newReward)
      }
      expect(sum).to.equal('16094999999999999999999999999685042666623901690000')
    })
  })
})
