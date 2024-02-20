import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommandInput } from "../commands/DescribeStacksCommand";
/**
 * Wait until stack status is UPDATE_COMPLETE.
 *  @deprecated Use waitUntilStackUpdateComplete instead. waitForStackUpdateComplete does not throw error in non-success cases.
 */
export declare const waitForStackUpdateComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
/**
 * Wait until stack status is UPDATE_COMPLETE.
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeStacksCommand for polling.
 */
export declare const waitUntilStackUpdateComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
