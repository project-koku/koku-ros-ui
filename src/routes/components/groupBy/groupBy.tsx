import { Title } from '@patternfly/react-core';
import type { SelectOptionObject } from '@patternfly/react-core/deprecated';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core/deprecated';
import type { Org, OrgPathsType } from 'api/orgs/org';
import { OrgType } from 'api/orgs/org';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import type { Resource, ResourcePathsType } from 'api/resources/resource';
import { ResourceType } from 'api/resources/resource';
import type { Tag, TagPathsType } from 'api/tags/tag';
import { TagType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import type { PerspectiveType } from 'routes/explorer/explorerUtils';
import { getDateRangeFromQuery } from 'routes/utils/dateRange';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { orgActions, orgSelectors } from 'store/orgs';
import { resourceActions, resourceSelectors } from 'store/resources';
import { tagActions, tagSelectors } from 'store/tags';
import { awsCategoryKey, awsCategoryPrefix, orgUnitIdKey, tagKey, tagPrefix } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './groupBy.styles';
import { GroupByOrg } from './groupByOrg';
import { GroupBySelect } from './groupBySelect';

interface GroupByOwnProps extends RouterComponentProps, WrappedComponentProps {
  getIdKeyForGroupBy: (groupBy: Query['group_by']) => string;
  groupBy?: string;
  isDisabled?: boolean;
  onSelected(value: string);
  options: {
    label: string;
    value: string;
  }[];
  orgPathsType?: OrgPathsType;
  perspective?: PerspectiveType;
  resourcePathsType: ResourcePathsType;
  showCostCategories?: boolean;
  showOrgs?: boolean;
  showTags?: boolean;
  tagPathsType: TagPathsType;
}

interface GroupByStateProps {
  orgReport?: Org;
  orgReportFetchStatus?: FetchStatus;
  orgQueryString?: string;
  resourceReport?: Resource;
  resourceReportFetchStatus?: FetchStatus;
  resourceQueryString?: string;
  tagReport?: Tag;
  tagReportFetchStatus?: FetchStatus;
  tagQueryString?: string;
}

interface GroupByDispatchProps {
  fetchOrg?: typeof orgActions.fetchOrg;
  fetchResource?: typeof resourceActions.fetchResource;
  fetchTag?: typeof tagActions.fetchTag;
}

interface GroupByState {
  currentItem?: string;
  defaultItem?: string;
  isGroupByCostCategoryVisible?: boolean;
  isGroupByOpen?: boolean;
  isGroupByOrgVisible?: boolean;
  isGroupByTagVisible?: boolean;
}

interface GroupByOption extends SelectOptionObject {
  toString(): string; // label
  value?: string;
}

type GroupByProps = GroupByOwnProps & GroupByStateProps & GroupByDispatchProps;

const groupByOrgOptions: {
  label: string;
  value: string;
}[] = [{ label: orgUnitIdKey, value: orgUnitIdKey }];

const groupByCostCategoryOptions: {
  label: string;
  value: string;
}[] = [{ label: awsCategoryKey, value: awsCategoryKey }];

const groupByTagOptions: {
  label: string;
  value: string;
}[] = [{ label: tagKey, value: tagKey }];

const orgType = OrgType.org;
const resourceType = ResourceType.aws_category;
const tagType = TagType.tag;

class GroupByBase extends React.Component<GroupByProps, GroupByState> {
  protected defaultState: GroupByState = {
    defaultItem: this.props.groupBy || this.props.options[0].value,
    isGroupByCostCategoryVisible: false,
    isGroupByOpen: false,
    isGroupByOrgVisible: false,
    isGroupByTagVisible: false,
  };
  public state: GroupByState = { ...this.defaultState };

  constructor(stateProps, dispatchProps) {
    super(stateProps, dispatchProps);
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.handleOnToggle = this.handleOnToggle.bind(this);
  }

  public componentDidMount() {
    this.setState(
      {
        currentItem: this.getCurrentGroupBy(),
      },
      () => {
        this.updateReport();
      }
    );
  }

  public componentDidUpdate(prevProps: GroupByProps) {
    const { groupBy, perspective } = this.props;
    if (prevProps.groupBy !== groupBy || prevProps.perspective !== perspective) {
      let options;
      if (prevProps.perspective !== perspective) {
        options = {
          isGroupByCostCategoryVisible: false,
          isGroupByOrgVisible: false,
          isGroupByTagVisible: false,
        };
      }
      this.setState({ currentItem: this.getCurrentGroupBy(), ...(options ? options : {}) }, () => {
        this.updateReport();
      });
    }
  }

  private getCurrentGroupBy = () => {
    const { getIdKeyForGroupBy, router } = this.props;
    const { defaultItem } = this.state;

    const queryFromRoute = parseQuery<Query>(router.location.search);
    if (!queryFromRoute?.group_by) {
      return defaultItem;
    }

    let groupBy: string = getIdKeyForGroupBy(queryFromRoute.group_by);
    const groupByKeys = queryFromRoute?.group_by ? Object.keys(queryFromRoute.group_by) : [];

    for (const key of groupByKeys) {
      let index = key.indexOf(tagPrefix);
      if (index !== -1) {
        groupBy = tagKey;
        this.setState({
          isGroupByTagVisible: true,
        });
        break;
      }
      index = key.indexOf(orgUnitIdKey);
      if (index !== -1) {
        groupBy = orgUnitIdKey;
        this.setState({
          isGroupByOrgVisible: true,
        });
        break;
      }
      index = key.indexOf(awsCategoryPrefix);
      if (index !== -1) {
        groupBy = awsCategoryKey;
        this.setState({
          isGroupByCostCategoryVisible: true,
        });
        break;
      }
    }
    return groupBy !== 'date' ? groupBy : defaultItem;
  };

  private getGroupBy = () => {
    const { isDisabled } = this.props;
    const { currentItem, isGroupByOpen } = this.state;

    const selectOptions = this.getGroupByOptions();
    const selection = selectOptions.find((option: GroupByOption) => option.value === currentItem);

    return (
      <Select
        id="groupBySelect"
        isDisabled={isDisabled}
        isOpen={isGroupByOpen}
        onSelect={(_evt, value) => this.handleOnSelect(value)}
        onToggle={(_evt, isExpanded) => this.handleOnToggle(isExpanded)}
        selections={selection}
        variant={SelectVariant.single}
      >
        {selectOptions.map(option => (
          <SelectOption key={option.value} value={option} />
        ))}
      </Select>
    );
  };

  private getGroupByOptions = (): GroupByOption[] => {
    const { options, orgReport, resourceReport, tagReport, intl } = this.props;

    const allOptions = [...options];
    if (orgReport?.data?.length > 0) {
      allOptions.push(...groupByOrgOptions);
    }
    if (tagReport?.data?.length > 0) {
      allOptions.push(...groupByTagOptions);
    }
    if (resourceReport?.data?.length > 0) {
      allOptions.push(...groupByCostCategoryOptions);
    }
    return allOptions
      .map(option => ({
        toString: () => intl.formatMessage(messages.groupByValuesTitleCase, { value: option.label, count: 1 }),
        value: option.value,
      }))
      .sort((a, b) => {
        if (a.toString() < b.toString()) {
          return -1;
        }
        if (a.toString() > b.toString()) {
          return 1;
        }
        return 0;
      });
  };

  private handleOnSelect = (selection: GroupByOption) => {
    const { onSelected } = this.props;

    if (selection.value === orgUnitIdKey || selection.value === awsCategoryKey || selection.value === tagKey) {
      this.setState({
        currentItem: selection.value,
        isGroupByCostCategoryVisible: selection.value === awsCategoryKey,
        isGroupByOpen: false,
        isGroupByOrgVisible: selection.value === orgUnitIdKey,
        isGroupByTagVisible: selection.value === tagKey,
      });
    } else {
      this.setState(
        {
          currentItem: selection.value,
          isGroupByCostCategoryVisible: false,
          isGroupByOpen: false,
          isGroupByOrgVisible: false,
          isGroupByTagVisible: false,
        },
        () => {
          if (onSelected) {
            onSelected(selection.value);
          }
        }
      );
    }
  };

  private handleOnToggle = isGroupByOpen => {
    this.setState({
      isGroupByOpen,
    });
  };

  private updateReport = () => {
    const {
      fetchOrg,
      fetchResource,
      fetchTag,
      orgPathsType,
      orgQueryString,
      showCostCategories,
      showOrgs,
      showTags,
      resourcePathsType,
      resourceQueryString,
      tagPathsType,
      tagQueryString,
    } = this.props;

    if (showCostCategories) {
      fetchResource(resourcePathsType, resourceType, resourceQueryString);
    }
    if (showOrgs) {
      fetchOrg(orgPathsType, orgType, orgQueryString);
    }
    if (showTags) {
      fetchTag(tagPathsType, tagType, tagQueryString);
    }
  };

  public render() {
    const {
      getIdKeyForGroupBy,
      groupBy,
      intl,
      isDisabled = false,
      onSelected,
      orgReport,
      resourceReport,
      tagReport,
    } = this.props;
    const { isGroupByOrgVisible, isGroupByCostCategoryVisible, isGroupByTagVisible } = this.state;

    return (
      <div style={styles.groupBySelector}>
        <Title headingLevel="h3" size="md" style={styles.groupBySelectorLabel}>
          {intl.formatMessage(messages.groupByLabel)}
        </Title>
        {this.getGroupBy()}
        {isGroupByOrgVisible && (
          <GroupByOrg
            getIdKeyForGroupBy={getIdKeyForGroupBy}
            groupBy={groupBy}
            isDisabled={isDisabled}
            onSelected={onSelected}
            options={groupByOrgOptions}
            orgReport={orgReport}
          />
        )}
        {isGroupByTagVisible && (
          <GroupBySelect
            groupBy={groupBy}
            isDisabled={isDisabled}
            onSelected={onSelected}
            options={groupByTagOptions}
            report={tagReport}
          />
        )}
        {isGroupByCostCategoryVisible && (
          <GroupBySelect
            groupBy={groupBy}
            isCostCategory
            isDisabled={isDisabled}
            onSelected={onSelected}
            options={groupByCostCategoryOptions}
            report={resourceReport}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<GroupByOwnProps, GroupByStateProps>(
  (state, { orgPathsType, router, resourcePathsType, tagPathsType }) => {
    const queryFromRoute = parseQuery<Query>(router.location.search);

    // Default to current month filter for details pages
    let tagFilter: any = {
      filter: {
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
    };

    // Replace with start and end dates for Cost Explorer
    if (queryFromRoute.dateRangeType) {
      const { end_date, start_date } = getDateRangeFromQuery(queryFromRoute);

      tagFilter = {
        end_date,
        start_date,
      };
    }

    // Note: Omitting key_only would help to share a single, cached request -- the toolbar requires key values
    // However, for better server-side performance, we chose to use key_only here.
    const baseQuery = {
      ...tagFilter,
      key_only: true,
      limit: 1000,
    };

    const resourceQueryString = getQuery({
      key_only: true,
    });
    const resourceReport = resourceSelectors.selectResource(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );
    const resourceReportFetchStatus = resourceSelectors.selectResourceFetchStatus(
      state,
      resourcePathsType,
      resourceType,
      resourceQueryString
    );

    const tagQueryString = getQuery({
      ...baseQuery,
    });
    const tagReport = tagSelectors.selectTag(state, tagPathsType, tagType, tagQueryString);
    const tagReportFetchStatus = tagSelectors.selectTagFetchStatus(state, tagPathsType, tagType, tagQueryString);

    const orgQueryString = getQuery({
      ...baseQuery,
    });
    const orgReport = orgSelectors.selectOrg(state, orgPathsType, orgType, orgQueryString);
    const orgReportFetchStatus = orgSelectors.selectOrgFetchStatus(state, orgPathsType, orgType, orgQueryString);

    return {
      orgReport,
      orgReportFetchStatus,
      orgQueryString,
      resourceReport,
      resourceReportFetchStatus,
      resourceQueryString,
      tagReport,
      tagReportFetchStatus,
      tagQueryString,
    };
  }
);

const mapDispatchToProps: GroupByDispatchProps = {
  fetchOrg: orgActions.fetchOrg,
  fetchResource: resourceActions.fetchResource,
  fetchTag: tagActions.fetchTag,
};

const GroupByConnect = connect(mapStateToProps, mapDispatchToProps)(GroupByBase);
const GroupBy = injectIntl(withRouter(GroupByConnect));

export default GroupBy;
