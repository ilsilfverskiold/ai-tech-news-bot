import { Paginator } from "@smithy/types";
import {
  ListStackSetOperationsCommandInput,
  ListStackSetOperationsCommandOutput,
} from "../commands/ListStackSetOperationsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListStackSetOperations: (
  config: CloudFormationPaginationConfiguration,
  input: ListStackSetOperationsCommandInput,
  ...rest: any[]
) => Paginator<ListStackSetOperationsCommandOutput>;
