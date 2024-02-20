import { checkExceptions, createWaiter, WaiterState } from "@smithy/util-waiter";
import { DescribeChangeSetCommand } from "../commands/DescribeChangeSetCommand";
const checkState = async (client, input) => {
    let reason;
    try {
        const result = await client.send(new DescribeChangeSetCommand(input));
        reason = result;
        try {
            const returnComparator = () => {
                return result.Status;
            };
            if (returnComparator() === "CREATE_COMPLETE") {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                return result.Status;
            };
            if (returnComparator() === "FAILED") {
                return { state: WaiterState.FAILURE, reason };
            }
        }
        catch (e) { }
    }
    catch (exception) {
        reason = exception;
        if (exception.name && exception.name == "ValidationError") {
            return { state: WaiterState.FAILURE, reason };
        }
    }
    return { state: WaiterState.RETRY, reason };
};
export const waitForChangeSetCreateComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 30, maxDelay: 120 };
    return createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
export const waitUntilChangeSetCreateComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 30, maxDelay: 120 };
    const result = await createWaiter({ ...serviceDefaults, ...params }, input, checkState);
    return checkExceptions(result);
};
