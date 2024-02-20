import { Paginator } from "@smithy/types";
import { ListStackResourcesCommandInput, ListStackResourcesCommandOutput } from "../commands/ListStackResourcesCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListStackResources: (config: CloudFormationPaginationConfiguration, input: ListStackResourcesCommandInput, ...rest: any[]) => Paginator<ListStackResourcesCommandOutput>;
