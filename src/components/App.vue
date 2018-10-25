<template>
  <div id="app-root">
    <header class="site-header app group">
      <div class="row expanded">
        <div class="columns">
          <a href="//beta.phila.gov" class="logo">
            <img src="https://standards.phila.gov/img/logo/city-of-philadelphia-yellow-white.png" alt="City of Philadelphia">
          </a>
          <div class="app-divide"></div>
          <div class="page-title-container">
            <a href="#/">
              <h1 class="page-title">PVC-PVD Example App</h1>
            </a>
          </div>
        </div>
      </div>
    </header>

    <div id="components-root">
      <address-input />

      <div class="margin-sides-20 component-label">vertical-table:</div>
      <vertical-table
        class="margin-20 margin-bottom-60 medium-8"
        :slots="{
          fields: [
            {
              label: 'address',
              value: function(state) {
                if (state.geocode.data) {
                  return state.geocode.data.properties.street_address;
                } else {
                  return '';
                }
              },
            },
            {
              label: 'opa #',
              value: function(state) {
                if (state.geocode.data) {
                  return state.geocode.data.properties.opa_account_num;
                } else {
                  return '';
                }
              },
            },
            {
              label: 'owner',
              value: function(state) {
                if (state.sources.opa.data) {
                  return state.sources.opa.data.owner_1;
                } else {
                  return '';
                }
              },
            },
          ]
        }"
        :options="{
          id: 'verticalTableId',
          externalLink: {
            action: function() {
              return 'See more';
            },
            name: 'Atlas',
            href: 'https://atlas.phila.gov'
          }
        }"
      />

      <div class="margin-sides-20 component-label">horizontal-table:</div>
      <horizontal-table
        class="margin-20 medium-10"
        :slots="{
          title: 'DOR Docs',
          items: function(state) {
            var id;
            if (state.parcels.dor.data) {
              if (state.parcels.dor.data[0]) {
                id = state.parcels.dor.data[0].properties.OBJECTID;
                if (state.sources.dorDocuments.targets[id]) {
                  return state.sources.dorDocuments.targets[id].data;
                } else {
                  return [];
                }
              } else {
                return [];
              }
            } else {
              return [];
            }
          },
        }"
        :options="{
          id: 'dorDocs',
          limit: 2,
          fields: [
            {
              label: 'Doc Type',
              value: function(state, item){
                return item.attributes.DOCUMENT_TYPE;
              }
            },
            {
              label: 'Grantors',
              value: function(state, item){
                return item.attributes.GRANTORS;
              }
            },
            {
              label: 'Grantees',
              value: function(state, item){
                return item.attributes.GRANTEES;
              }
            },
            {
              label: 'Number',
              value: function(state, item){
                return item.attributes.R_NUM;
              }
            },
          ],
          externalLink: {
            action: function(count) {
              return 'See ' + count + ' older DorDocs at Atlas';
            },
            name: 'L&I Property History',
            href: function(state) {
              return 'https://atlas.phila.gov/';
            }
          }
        }"
      />

    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  import philaVueComps from '@cityofphiladelphia/phila-vue-comps';
  const VerticalTable = philaVueComps.VerticalTable;
  const HorizontalTable = philaVueComps.HorizontalTable;
  const AddressInput = philaVueComps.AddressInput;

  export default {
    components: {
      VerticalTable,
      HorizontalTable,
      AddressInput,
    },
  };

</script>

<style scoped>

#app-root {
  height: 100%
}

#components-root {
  padding: 20px;
  height: 90%;
  overflow-y: auto;
}

.component-label {
  font-size: 20px;
}

.margin-sides-20 {
  display: block;
  margin-left: 20px;
  margin-right: 20px;
}

.margin-20 {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}

.margin-bottom-60 {
  margin-bottom: 60px !important;
}

.ib {
  display: inline-block;
}





</style>
