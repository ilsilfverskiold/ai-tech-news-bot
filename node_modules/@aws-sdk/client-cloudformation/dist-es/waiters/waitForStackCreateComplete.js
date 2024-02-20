import { checkExceptions, createWaiter, WaiterState } from "@smithy/util-waiter";
import { DescribeStacksCommand } from "../commands/DescribeStacksCommand";
const checkState = async (client, input) => {
    let reason;
    try {
        const result = await client.send(new DescribeStacksCommand(input));
        reason = result;
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "CREATE_COMPLETE";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "UPDATE_COMPLETE";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "UPDATE_IN_PROGRESS";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "UPDATE_COMPLETE_CLEANUP_IN_PROGRESS";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "UPDATE_FAILED";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "UPDATE_ROLLBACK_IN_PROGRESS";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "UPDATE_ROLLBACK_FAILED";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            let allStringEq_5 = returnComparator().length > 0;
            for (const element_4 of returnComparator()) {
                allStringEq_5 = allStringEq_5 && element_4 == "UPDATE_ROLLBACK_COMPLETE";
            }
            if (allStringEq_5) {
                return { state: WaiterState.SUCCESS, reason };
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            for (const anyStringEq_4 of returnComparator()) {
                if (anyStringEq_4 == "CREATE_FAILED") {
                    return { state: WaiterState.FAILURE, reason };
                }
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            for (const anyStringEq_4 of returnComparator()) {
                if (anyStringEq_4 == "DELETE_COMPLETE") {
                    return { state: WaiterState.FAILURE, reason };
                }
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            for (const anyStringEq_4 of returnComparator()) {
                if (anyStringEq_4 == "DELETE_FAILED") {
                    return { state: WaiterState.FAILURE, reason };
                }
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            for (const anyStringEq_4 of returnComparator()) {
                if (anyStringEq_4 == "ROLLBACK_FAILED") {
                    return { state: WaiterState.FAILURE, reason };
                }
            }
        }
        catch (e) { }
        try {
            const returnComparator = () => {
                const flat_1 = [].concat(...result.Stacks);
                const projection_3 = flat_1.map((element_2) => {
                    return element_2.StackStatus;
                });
                return projection_3;
            };
            for (const anyStringEq_4 of returnComparator()) {
                if (anyStringEq_4 == "ROLLBACK_COMPLETE") {
                    return { state: WaiterState.FAILURE, reason };
                }
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
export const waitForStackCreateComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 30, maxDelay: 120 };
    return createWaiter({ ...serviceDefaults, ...params }, input, checkState);
};
export const waitUntilStackCreateComplete = async (params, input) => {
    const serviceDefaults = { minDelay: 30, maxDelay: 120 };
    const result = await createWaiter({ ...serviceDefaults, ...params }, input, checkState);
    return checkExceptions(result);
};
