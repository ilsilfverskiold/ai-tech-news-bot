import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeTypeRegistrationCommandInput } from "../commands/DescribeTypeRegistrationCommand";
/**
 * Wait until type registration is COMPLETE.
 *  @deprecated Use waitUntilTypeRegistrationComplete instead. waitForTypeRegistrationComplete does not throw error in non-success cases.
 */
export declare const waitForTypeRegistrationComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeTypeRegistrationCommandInput) => Promise<WaiterResult>;
/**
 * Wait until type registration is COMPLETE.
 *  @param params - Waiter configuration options.
 *  @param input - The input to DescribeTypeRegistrationCommand for polling.
 */
export declare const waitUntilTypeRegistrationComplete: (params: WaiterConfiguration<CloudFormationClient>, input: DescribeTypeRegistrationCommandInput) => Promise<WaiterResult>;
