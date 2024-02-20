import { Paginator } from "@smithy/types";
import {
  ListResourceScanResourcesCommandInput,
  ListResourceScanResourcesCommandOutput,
} from "../commands/ListResourceScanResourcesCommand";
import { CloudFormationPaginationConfiguration } from "./Interfaces";
export declare const paginateListResourceScanResources: (
  config: CloudFormationPaginationConfiguration,
  input: ListResourceScanResourcesCommandInput,
  ...rest: any[]
) => Paginator<ListResourceScanResourcesCommandOutput>;
