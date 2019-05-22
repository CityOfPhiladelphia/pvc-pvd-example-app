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
              <h1 class="page-title">PVC PVD Example App</h1>
            </a>
          </div>
        </div>
      </div>
    </header>

    <div id="components-root"
    >

      <address-input
        :widthFromConfig="500"
        :placeholder="'testing address input'"
        name="'test'"
      />
      <br>
      <br>

      <badge
        :slots="{
          title: 'Address or Intersection Found',
          value: function(state) {
            if (state.geocode.data) {
              if (state.geocode.data.ais_feature_type === 'intersection') {
                return state.geocode.data.street_address
              } else {
                return state.geocode.data.properties.street_address
              }
            } else {
              return 'no address yet'
            }
          }
        }"
      />

      <div class="margin-sides-20 component-label">vertical-table:</div>
      <vertical-table
        class="margin-20 margin-bottom-60 medium-8"
        :slots="{
          fields: [
            {
              label: 'address',
              value: function(state) {
                return state.geocode.data.properties.street_address || '';
              },
            },
            {
              label: 'opa #',
              value: function(state) {
                return state.geocode.data.properties.opa_account_num;
              },
            },
            {
              label: 'owner',
              value: function(state) {
                return state.sources.opa.data.owner_1;
              },
            },
          ]
        }"
        :options="{
          id: 'verticalTableId',
          dataSources: ['opa'],
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
          title: 'Owner Properties',
          items: function(state) {
            var data = state.ownerSearch.data;
            return data;
          },
        }"
        :options="this.ownerOptions"
      />

      <horizontal-table
        class="margin-20 medium-10"
        :slots="{
          title: 'Permits',
          items: function(state) {
            var data = state.sources['liPermits'].data.rows;
            var rows = data.map(function(row){
              var itemRow = row;
              return itemRow;
            });
            return rows;
          },
        }"
        :options="{
          id: 'liPermits',
          tableId: 'bbb',
          dataSources: ['liPermits'],
          mapOverlay: {},
          limit: 5,
          fields: [
            {
              label: 'Date',
              value: function(state, item){
                return item.permitissuedate
              },
              nullValue: 'no date available',
              transforms: [
                'date'
              ]
            },
            {
              label: 'ID',
              value: function(state, item){
                return `<a target='_blank' href='http://li.phila.gov/#details?entity=permits&eid=`+item.permitnumber+`&key=`+item.addresskey+`&address=`+item.address+`'>`+item.permitnumber+` <i class='fa fa-external-link'></i></a>`
              }
            },
            {
              label: 'Description',
              value: function(state, item){
                return item.permitdescription
              },
              popoverLink: true,
              popoverPreText: function(state, item) {
                return ''
              }
            },
            {
              label: 'Status',
              value: function(state, item){
                return item.status
              }
            },
          ],
          sort: {
            getValue: function(item) {
              return item.permitissuedate;
            },
            order: 'desc'
          },
          externalLink: {
            action: function(count) {
              return 'See ' + count + ' older permits at L&I Property History';
              },
            name: 'L&I Property History',
            href: function(state) {
              var address = state.geocode.data.properties.street_address;
              var addressEncoded = encodeURIComponent(address);
              return 'http://li.phila.gov/#summary?address=' + addressEncoded;
            }
          }
        }"
      />

      <horizontal-table
        class="margin-20 medium-10"
        :slots="{
          title: 'DOR Docs',
          items: function(state) {
            var id = state.parcels.dor.data[0].properties.OBJECTID;
            if (state.sources.dorDocuments.targets[id]) {
              return state.sources.dorDocuments.targets[id].data;
            } else {
              return [];
            }
          },
        }"
        :options="{
          id: 'dorDocs',
          tableId: 'aaa',
          dataSources: ['dorDocuments'],
          limit: 10,
          fields: [
            {
              label: 'Doc Type',
              value: function(state, item){
                return item.attributes.DOCUMENT_TYPE;
              },
              popoverLink: true,
              popoverTransforms: [
                'bold',
              ]
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
                return item.attributes.DOCUMENT_ID;
              }
            },
          ],
          /* externalLink: {
            action: function(count) {
              return 'See ' + count + ' older DorDocs at Atlas';
            },
            name: 'Dor Docs',
            href: function(state) {
              return 'https://atlas.phila.gov/';
            }
          } */
        }"
      />
      <popover-link
                    :options="{
                      height: '92%',
                      customStyle: { 'color': 'red', 'border-bottom': '0px' }
                    }"
                    :slots="{
                      shouldShowValue: true,
                      value: 'Test'
                    }"
      />
      <popover
               v-if="popoverOpen"
               :options="this.popoverOptions"
               :slots="{'text': this.popoverText}"
      />


    </div>
  </div>
</template>

<script>


  export default {
    components: {
      VerticalTable: () => import(/* webpackChunkName: "pvc_VerticalTable" */'@philly/vue-comps/src/components/VerticalTable.vue'),
      HorizontalTable: () => import(/* webpackChunkName: "pvc_HorizontalTable" */'@philly/vue-comps/src/components/HorizontalTable.vue'),
      AddressInput: () => import(/* webpackChunkName: "pvc_AddressInput" */'@philly/vue-comps/src/components/AddressInput.vue'),
      Badge: () => import(/* webpackChunkName: "pvc_Badge" */'@philly/vue-comps/src/components/Badge.vue'),
      Greeting: () => import(/* webpackChunkName: "pvc_Greeting" */'@philly/vue-comps/src/components/Greeting.vue'),
      Popover: () => import(/* webpackChunkName: "mbmb_pvc_Popover" */'@philly/vue-comps/src/components/Popover.vue'),
      PopoverLink: () => import(/* webpackChunkName: "mbmb_pvc_PopoverLink" */'@philly/vue-comps/src/components/PopoverLink.vue'),
    },
    data() {
      const data = {
        popoverLink_01_Slots: {
          value: 'popover-link 1',
          shouldShowValue: true,
          popoverPreText: 'this is the popoverPreText for a popover with shouldShowValue: ',
          popoverPostText: ' - this is the popoverPostText',
        },
        testIsTrue: false,
      }
      return data;
    },
    created() {

    },
    computed: {
      popoverOpen() {
        return this.$store.state.popover.open;
      },
      popoverText() {
        return this.$store.state.popover.text;
      },
      popoverOptions() {
        return this.$store.state.popover.options;
      },
      fullScreenTopicsEnabled() {
        return this.$store.state.fullScreenTopicsEnabled;
      },
      topicPanelContainerClass() {
        if (this.fullScreenTopicsEnabled || this.fullScreenTopicsOnly) {
          return 'medium-24 small-order-2 medium-order-1';
        } else if (this.fullScreenMapEnabled) {
          return 'medium-1 small-order-2 medium-order-1';
        } else {
          return 'medium-12 small-order-2 medium-order-1';
        }
      },
      computedHtml() {
        return 'second test text';
      },
      ownerOptions() {
        const options = {
          id: 'ownerProperties',
          tableId: 'ccc',
          mapOverlay: {},
          /* dataSources: ['liPermits'], */
          /* limit: 5, */
          fields: [
            {
              label: 'Owner',
              value: function(state, item){
                return item.properties.opa_owners.toString();
              },
              /* nullValue: 'no date available', */
            },
            {
              label: 'Street Address',
              value: function(state, item, controller) {
                const test = controller.test
                /* controller.test(); */
                return `<a target='_blank' href='https://atlas.phila.gov/#/`+item.properties.street_address+`/property'>`+item.properties.street_address+` <i class='fa fa-external-link'></i></a>`
                // return '<a href=# onclick="'+test+'()">'+item.properties.street_address+' <i class="fa fa-external-link"></i></a>'
              }
            },
            {
              label: 'Description',
              value: function(state, item){
                /* return item.permitdescription */
              }
            },
            {
              label: 'Status',
              value: function(state, item){
                /* return item.status */
              }
            },
          ],
          /* sort: {
            getValue: function(item) {
              return item.permitissuedate;
            },
            order: 'desc'
          }, */
          /* externalLink: {
            action: function(count) {
              return 'See ' + count + ' older permits at L&I Property History';
              },
            name: 'L&I Property History',
            href: function(state) {
              var address = state.geocode.data.properties.street_address;
              var addressEncoded = encodeURIComponent(address);
              return 'http://li.phila.gov/#summary?address=' + addressEncoded;
            }
          } */
        }
        return options;
      }
    },
    methods: {
      // genId() {
      //   generateUniqueId()
      // },
    //   assignTableIds(comps) {
    //     for (let comp of comps) {
    //       const options = comp.options || {};
    //       const innerComps = options.components || options.tables;
    //
    //       // if this is a "group" component, recurse
    //       if (innerComps) {
    //         assignTableIds(innerComps);
    //         // return;
    //       }
    //
    //       // skip comps that aren't horizontal tables
    //       if (comp.type !== 'horizontal-table') {
    //         continue;
    //       }
    //
    //        const id = generateUniqueId();
    //        // comp._id = id;
    //        // the id also needs to get passed to the horizontal table component, so
    //        // use the options object.
    //        comp.options.tableId = id;
    //     }
    //   }
    }
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
