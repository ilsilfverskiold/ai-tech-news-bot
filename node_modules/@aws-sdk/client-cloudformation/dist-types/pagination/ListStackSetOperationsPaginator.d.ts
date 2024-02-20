import { Paginator } from "@smithy/types";
import { ListStackSetOperationsCommandInput, ListStackSetOperationsCommandOutput } from "../commands/ListStackSetOperationsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListStackSetOperations: (config: CloudFormationPaginationConfiguration, input: ListStackSetOperationsCommandInput, ...rest: any[]) => Paginator<ListStackSetOperationsCommandOutput>;
