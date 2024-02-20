import { Paginator } from "@smithy/types";
import {
  ListStackSetsCommandInput,
  ListStackSetsCommandOutput,
} from "../commands/ListStackSetsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListStackSets: (
  config: CloudFormationPaginationConfiguration,
  input: ListStackSetsCommandInput,
  ...rest: any[]
) => Paginator<ListStackSetsCommandOutput>;
