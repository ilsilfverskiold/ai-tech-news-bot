import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommandInput } from "../commands/DescribeStacksCommand";
/**
 * Wait until stack status is UPDATE_ROLLBACK_COMPLETE.
 *  @deprecated Use waitUntilStackRollbackComplete instead. waitForStackRollbackComplete does not throw error in non-success cases.
 */
export declare const waitForStackRollbackComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
/**
 * Wait until stack status is UPDATE_ROLLBACK_COMPLETE.
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeStacksCommand for polling.
 */
export declare const waitUntilStackRollbackComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
