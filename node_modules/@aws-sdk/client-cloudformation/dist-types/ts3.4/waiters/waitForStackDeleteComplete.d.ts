import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommandInput } from "../commands/DescribeStacksCommand";
export declare const waitForStackDeleteComplete: (
  params: WaiterConfiguration<CloudFormationClient>,
  input: DescribeStacksCommandInput
) => Promise<WaiterResult>;
export declare const waitUntilStackDeleteComplete: (
  params: WaiterConfiguration<CloudFormationClient>,
  input: DescribeStacksCommandInput
) => Promise<WaiterResult>;
