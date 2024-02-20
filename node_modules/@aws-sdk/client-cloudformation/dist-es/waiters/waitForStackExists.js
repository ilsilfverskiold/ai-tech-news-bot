import { checkExceptions, createWaiter, WaiterState } from "@smithy/util-waiter";
import { DescribeStacksCommand } from "../commands/DescribeStacksCommand";
const checkState = async (client, input) => {
    let reason;
    try {
        const result = await client.send(new DescribeStacksCommand(input));
        reason = result;
        return { state: WaiterState.SUCCESS, reason };
    }
    catch (exception) {
        reason = exception;
        if (exception.name && exception.name == "ValidationError") {
            return { state: WaiterState.RETRY, reason };
        }
    }
    return { state: WaiterState.RETRY, reason };
};
export const waitForStackExists = async (params, input) => {
    const serviceDefaults = { minDelay: 5, maxDelay: 120 };
    return createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
export const waitUntilStackExists = async (params, input) => {
    const serviceDefaults = { minDelay: 5, maxDelay: 120 };
    const result = await createWaiter({ ...serviceDefaults, ...params }, input, checkState);
    return checkExceptions(result);
};
