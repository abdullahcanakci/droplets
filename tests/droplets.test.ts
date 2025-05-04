import {beforeEach, describe, expect, it, vi} from 'vitest';
import Droplets from "../src";


describe('Droplets', () => {
    let droplet: Droplets<{}>

    beforeEach(() => {
        droplet = new Droplets<{}>();
    })

    it('should process consecutively', async () => {
        const stage1 = vi.fn(() => true)
        const stage2 = vi.fn(() => true)


        droplet.add(stage1)
        droplet.add(stage2)

        await droplet.run({})

        expect(stage1).toBeCalled()
        expect(stage2).toBeCalled()
    });


    it('should break on error', async () => {
        const stage1 = vi.fn(() => {
            throw new Error('test error')
        })
        const errorStage = vi.fn(() => false)
        const stage2 = vi.fn(() => true)


        droplet.add(stage1)
        droplet.catch(errorStage)
        droplet.add(stage2)

        await droplet.run({})

        expect(stage1).toBeCalled()
        expect(errorStage).toBeCalled()
        expect(stage2).not.toBeCalled()
    })

    it('should continue on error', async () => {
        const stage1 = vi.fn(() => {
            throw new Error('test error')
        })
        const errorStage = vi.fn(() => true)
        const stage2 = vi.fn(() => true)


        droplet.add(stage1)
        droplet.catch(errorStage)
        droplet.add(stage2)

        await droplet.run({})

        expect(stage1).toBeCalled()
        expect(errorStage).toBeCalled()
        expect(stage2).toBeCalled()
    })
});