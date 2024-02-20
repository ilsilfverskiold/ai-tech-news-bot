import { Paginator } from "@smithy/types";
import { ListChangeSetsCommandInput, ListChangeSetsCommandOutput } from "../commands/ListChangeSetsCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
/**
 * @public
 */
export declare const paginateListChangeSets: (config: CloudFormationPaginationConfiguration, input: ListChangeSetsCommandInput, ...rest: any[]) => Paginator<ListChangeSetsCommandOutput>;
