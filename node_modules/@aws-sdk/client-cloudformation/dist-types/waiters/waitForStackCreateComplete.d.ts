import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommandInput } from "../commands/DescribeStacksCommand";
/**
 * Wait until stack status is CREATE_COMPLETE.
 *  @deprecated Use waitUntilStackCreateComplete instead. waitForStackCreateComplete does not throw error in non-success cases.
 */
export declare const waitForStackCreateComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
/**
 * Wait until stack status is CREATE_COMPLETE.
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeStacksCommand for polling.
 */
export declare const waitUntilStackCreateComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
