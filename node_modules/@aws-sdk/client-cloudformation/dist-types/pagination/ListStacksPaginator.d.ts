import { Paginator } from "@smithy/types";
import { ListStacksCommandInput, ListStacksCommandOutput } from "../commands/ListStacksCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListStacks: (config: CloudFormationPaginationConfiguration, input: ListStacksCommandInput, ...rest: any[]) => Paginator<ListStacksCommandOutput>;
