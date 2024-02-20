import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommandInput } from "../commands/DescribeStacksCommand";
/**
 * Wait until stack status is IMPORT_COMPLETE.
 *  @deprecated Use waitUntilStackImportComplete instead. waitForStackImportComplete does not throw error in non-success cases.
 */
export declare const waitForStackImportComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
/**
 * Wait until stack status is IMPORT_COMPLETE.
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeStacksCommand for polling.
 */
export declare const waitUntilStackImportComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
