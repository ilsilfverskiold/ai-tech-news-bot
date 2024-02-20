import { Paginator } from "@smithy/types";
import {
  ListStackResourcesCommandInput,
  ListStackResourcesCommandOutput,
} from "../commands/ListStackResourcesCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListStackResources: (
  config: CloudFormationPaginationConfiguration,
  input: ListStackResourcesCommandInput,
  ...rest: any[]
) => Paginator<ListStackResourcesCommandOutput>;
