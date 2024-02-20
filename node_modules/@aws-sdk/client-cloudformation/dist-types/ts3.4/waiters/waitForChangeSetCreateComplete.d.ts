import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeChangeSetCommandInput } from "../commands/DescribeChangeSetCommand";
export declare const waitForChangeSetCreateComplete: (
  params: WaiterConfiguration<CloudFormationClient>,
  input: DescribeChangeSetCommandInput
) => Promise<WaiterResult>;
export declare const waitUntilChangeSetCreateComplete: (
  params: WaiterConfiguration<CloudFormationClient>,
  input: DescribeChangeSetCommandInput
) => Promise<WaiterResult>;
