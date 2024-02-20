import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommandInput } from "../commands/DescribeStacksCommand";
/**
 * Wait until stack status is DELETE_COMPLETE.
 *  @deprecated Use waitUntilStackDeleteComplete instead. waitForStackDeleteComplete does not throw error in non-success cases.
 */
export declare const waitForStackDeleteComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
/**
 * Wait until stack status is DELETE_COMPLETE.
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeStacksCommand for polling.
 */
export declare const waitUntilStackDeleteComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
