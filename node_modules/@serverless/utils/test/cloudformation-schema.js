'use strict';

const { expect } = require('chai');
const cloudformationSchema = require('../cloudformation-schema');

describe('cloudformation-schema', () => {
  it('should contain schema', () => {
    expect(Object.keys(cloudformationSchema)).to.be.eql([
      'implicit',
      'explicit',
      'compiledImplicit',
      'compiledExplicit',
      'compiledTypeMap',
    ]);
  });

  it('should compile AWS Cloudformation short-hand syntax to long Fn:: syntax', () => {
    const importValueTypes = cloudformationSchema.explicit.filter(
      (type) => type.tag === '!ImportValue'
    );
    expect(importValueTypes.pop().construct('MyImportedValue')).to.be.eql({
      'Fn::ImportValue': 'MyImportedValue',
    });
  });

  it('should compile AWS Cloudformation short-hand syntax to normal syntax without Fn:: for Ref', () => {
    const refTypes = cloudformationSchema.explicit.filter((type) => type.tag === '!Ref');
    expect(refTypes.pop().construct('MyRef')).to.be.eql({ Ref: 'MyRef' });
  });

  it('should compile AWS Cloudformation short-hand syntax to normal syntax without Fn:: for Condition', () => {
    const conditionTypes = cloudformationSchema.explicit.filter(
      (type) => type.tag === '!Condition'
    );
    expect(conditionTypes.pop().construct('MyCondition')).to.be.eql({ Condition: 'MyCondition' });
  });

  it('should compile AWS Cloudformation short-hand syntax to dotted syntax for GetAtt', () => {
    const getAttTypes = cloudformationSchema.explicit.filter((type) => type.tag === '!GetAtt');
    expect(getAttTypes.pop().construct('MyResource.Arn')).to.be.eql({
      'Fn::GetAtt': ['MyResource', 'Arn'],
    });
  });
});
