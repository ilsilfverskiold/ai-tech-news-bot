import { Paginator } from "@smithy/types";
import {
  DescribeStacksCommandInput,
  DescribeStacksCommandOutput,
} from "../commands/DescribeStacksCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeStacks: (
  config: CloudFormationPaginationConfiguration,
  input: DescribeStacksCommandInput,
  ...rest: any[]
) => Paginator<DescribeStacksCommandOutput>;
