import { Paginator } from "@smithy/types";
import {
  DescribeAccountLimitsCommandInput,
  DescribeAccountLimitsCommandOutput,
} from "../commands/DescribeAccountLimitsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateDescribeAccountLimits: (
  config: CloudFormationPaginationConfiguration,
  input: DescribeAccountLimitsCommandInput,
  ...rest: any[]
) => Paginator<DescribeAccountLimitsCommandOutput>;
