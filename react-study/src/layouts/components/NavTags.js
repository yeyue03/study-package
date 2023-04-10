import React from 'react';
import { Tag } from 'antd';
import { connect } from 'react-redux';

const NavTags = (props) => {
  console.log("=== props", props);
  return (
    <div className="tags-wrap">
      {
        props.navTabList.map(item => {
          return (
            <Tag key={item.key} closable>
              { item.name }
            </Tag>
          )
        })
      }
    </div>
  );
};

const mapStateToProps = ({ navTag }) => {
  return {
    navTabList: navTag.navTabList
  }
}

export default connect(mapStateToProps)(NavTags);