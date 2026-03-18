import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const ApiDocs = () => {
  return (
    <div className="api-docs-container">
      <SwaggerUI url="/swagger.json" />
      <style dangerouslySetInnerHTML={{ __html: `
        .api-docs-container {
          background-color: #fff;
          min-height: 100vh;
          padding: 20px;
        }
        .swagger-ui .topbar { display: none; }
      `}} />
    </div>
  );
};

export default ApiDocs;
