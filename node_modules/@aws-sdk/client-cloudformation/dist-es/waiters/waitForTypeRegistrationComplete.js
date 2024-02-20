import { checkExceptions, createWaiter, WaiterState } from "@smithy/util-waiter";
import { DescribeTypeRegistrationCommand, } from "../commands/DescribeTypeRegistrationCommand";
const checkState = async (client, input) => {
    let reason;
    try {
        const result = await client.send(new DescribeTypeRegistrationCommand(input));
        reason = result;
        try {
            const returnComparator = () => {
                return result.ProgressStatus;
            };
            if (returnComparator() === "COMPLETE") {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                return result.ProgressStatus;
            };
            if (returnComparator() === "FAILED") {
                return { state: WaiterState.FAILURE, reason };
            }
        }
        catch (e) { }
    }
    catch (exception) {
        reason = exception;
    }
    return { state: WaiterState.RETRY, reason };
};
export const waitForTypeRegistrationComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 30, maxDelay: 120 };
    return createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
export const waitUntilTypeRegistrationComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 30, maxDelay: 120 };
    const result = await createWaiter({ ...serviceDefaults, ...params }, input, checkState);
    return checkExceptions(result);
};
