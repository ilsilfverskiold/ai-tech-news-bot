import { Paginator } from "@smithy/types";
import { ListImportsCommandInput, ListImportsCommandOutput } from "../commands/ListImportsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListImports: (config: CloudFormationPaginationConfiguration, input: ListImportsCommandInput, ...rest: any[]) => Paginator<ListImportsCommandOutput>;
