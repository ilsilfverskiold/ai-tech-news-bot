import { Paginator } from "@smithy/types";
import {
  DescribeStackResourceDriftsCommandInput,
  DescribeStackResourceDriftsCommandOutput,
} from "../commands/DescribeStackResourceDriftsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeStackResourceDrifts: (
  config: CloudFormationPaginationConfiguration,
  input: DescribeStackResourceDriftsCommandInput,
  ...rest: any[]
) => Paginator<DescribeStackResourceDriftsCommandOutput>;
