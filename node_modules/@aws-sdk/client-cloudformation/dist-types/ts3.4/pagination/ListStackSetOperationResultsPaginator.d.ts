import { Paginator } from "@smithy/types";
import {
  ListStackSetOperationResultsCommandInput,
  ListStackSetOperationResultsCommandOutput,
} from "../commands/ListStackSetOperationResultsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListStackSetOperationResults: (
  config: CloudFormationPaginationConfiguration,
  input: ListStackSetOperationResultsCommandInput,
  ...rest: any[]
) => Paginator<ListStackSetOperationResultsCommandOutput>;
