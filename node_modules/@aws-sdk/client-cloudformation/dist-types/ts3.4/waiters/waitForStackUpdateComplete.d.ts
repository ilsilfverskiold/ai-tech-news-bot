import { WaiterConfiguration, WaiterResult } from "@smithy/util-waiter";
import { CloudFormationClient } from "../CloudFormationClient";
import { DescribeStacksCommandInput } from "../commands/DescribeStacksCommand";
export declare const waitForStackUpdateComplete: (
  params: WaiterConfiguration<CloudFormationClient>,
  input: DescribeStacksCommandInput
) => Promise<WaiterResult>;
export declare const waitUntilStackUpdateComplete: (
  params: WaiterConfiguration<CloudFormationClient>,
  input: DescribeStacksCommandInput
) => Promise<WaiterResult>;
