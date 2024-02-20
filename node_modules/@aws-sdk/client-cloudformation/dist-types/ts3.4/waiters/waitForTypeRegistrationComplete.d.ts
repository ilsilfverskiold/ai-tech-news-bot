import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeTypeRegistrationCommandInput } from "../commands/DescribeTypeRegistrationCommand";
export declare const waitForTypeRegistrationComplete: (
  params: WaiterConfiguration<CloudFormationClient>,
  input: DescribeTypeRegistrationCommandInput
) => Promise<WaiterResult>;
export declare const waitUntilTypeRegistrationComplete: (
  params: WaiterConfiguration<CloudFormationClient>,
  input: DescribeTypeRegistrationCommandInput
) => Promise<WaiterResult>;
