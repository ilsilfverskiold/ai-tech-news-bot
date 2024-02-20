import { Paginator } from "@smithy/types";
import { ListTypeVersionsCommandInput, ListTypeVersionsCommandOutput } from "../commands/ListTypeVersionsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListTypeVersions: (config: CloudFormationPaginationConfiguration, input: ListTypeVersionsCommandInput, ...rest: any[]) => Paginator<ListTypeVersionsCommandOutput>;
