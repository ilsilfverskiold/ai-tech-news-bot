import { Paginator } from "@smithy/types";
import { ListExportsCommandInput, ListExportsCommandOutput } from "../commands/ListExportsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListExports: (config: CloudFormationPaginationConfiguration, input: ListExportsCommandInput, ...rest: any[]) => Paginator<ListExportsCommandOutput>;
