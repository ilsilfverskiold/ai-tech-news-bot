import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommandInput } from "../commands/DescribeStacksCommand";
/**
 *
 *  @deprecated Use waitUntilStackExists instead. waitForStackExists does not throw error in non-success cases.
 */
export declare const waitForStackExists: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
/**
 *
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeStacksCommand for polling.
 */
export declare const waitUntilStackExists: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeStacksCommandInput) => Promise<WaiterResult>;
