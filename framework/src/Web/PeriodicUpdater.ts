import { Destructible, Enumeration } from "../Standard/index.js"
import { URL } from "../Standard/URLs/URL.js";
import { DataContract } from "./DataContract.js";

export const PeriodicUpdaterStatus = Enumeration.create({
    Ready: null,
    Waiting: null,
    Offline: null
});

export class PeriodicUpdater extends Destructible {
    constructor(dataContract: DataContract, url: URL) {
        super();
    }

    protected destructor(): void {
        
    }
}

const MIN_UPDATE_PERIOD = 1;
const MAX_UPDATE_PERIOD = 60;
const UPDATE_PERIOD_MULTIPLIER = 5;