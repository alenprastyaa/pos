import{j as Ia,r as u,c as ia,y as ja,o as Ta,b as r,a as Sa,w as qa,d as t,p as K,v as H,B as T,u as ra,x as _,e as d,F as A,h as D,q as k,z as Ra,n as E,t as l,f as L,A as da}from"./index-BFzlO9JS.js";import{a as S,S as c}from"./sweetalert2.esm.all-BgBW3QO9.js";import{_ as za}from"./AdminLayout-b4MQjzol.js";import{_ as Ka}from"./_plugin-vue_export-helper-DlAUqK2U.js";const Aa={class:"page-container"},Da={class:"input-row"},Ma={class:"input-wrapper"},Va={class:"flex-row"},Na=["disabled"],Ha={class:"input-wrapper relative"},Ea=["onKeydown","disabled"],La={key:0,class:"search-dropdown border rounded-md bg-white shadow-lg"},Ua=["onClick"],Fa={class:"font-semibold text-sm"},Ga={class:"text-xs text-gray-600"},Oa=["onKeydown"],Ja={key:0,disabled:""},Ya=["value"],Qa={key:0,class:"debt-card"},Wa={class:"debt-content"},Xa={key:1,class:"pending-section"},Za={class:"pending-header"},ae={class:"pending-grid"},ee={class:"pending-customer"},te={class:"pending-total"},ne={class:"pending-actions"},se=["onClick"],oe=["onClick"],le={class:"table-container"},ie={class:"mobile-list"},re={key:0,class:"empty-state"},de={class:"mobile-item-header"},ue={class:"item-title"},ce=["onClick"],pe={class:"mobile-item-details"},ve={class:"item-barcode"},ge={class:"item-price"},me={class:"mobile-item-footer"},he={class:"qty-control"},fe=["onUpdate:modelValue","onChange"],be={class:"item-subtotal"},ye={class:"desktop-table"},_e={key:0},ke={class:"table-product-name"},we={class:"td-center"},xe=["onUpdate:modelValue","onChange"],Ce={class:"td-right table-price"},Be={class:"td-right table-subtotal"},$e={class:"td-center"},Pe=["onClick"],Ie={class:"table-footer"},je={class:"total-amount"},Te={class:"payment-row"},Se={class:"payment-input-group"},qe=["value","onKeydown"],Re={class:"payment-info-group"},ze={class:"change-label"},Ke={class:"change-value"},Ae={key:1,class:"change-placeholder"},De={class:"action-row"},Me=["disabled"],Ve=["disabled"],Ne={key:0,class:"spinner",fill:"none",viewBox:"0 0 24 24"},ua="pendingTransactions",He=Ia({__name:"PenjualanReguler",setup(Ee){const w="https://alentest.my.id/pos",b=u(0),Q=localStorage.getItem("role_name"),ca=new Audio("/barcode.mp3"),U=u([]),F=u(!1),q=u(!1),p=u(""),h=u(0),R=u(""),M=u(null),W=u(null),i=u([]),f=u([]),x=u(null),V=u(null),N=u(""),m=u([]),C=u(!1),g=u(-1),B=()=>({Authorization:`Bearer ${localStorage.getItem("authToken")}`}),$=ia(()=>i.value.reduce((a,e)=>a+e.qty*e.harga_jual_biasa,0)),P=ia(()=>{let a=h.value-$.value;return a>=0&&b.value>0&&(a=a-b.value),a}),v=a=>a==null||isNaN(a)?"Rp 0":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(a),pa=a=>new Date(a).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),va=async()=>{try{const a=await S.get(`${w}/user/my/data`,{headers:B()});a.data.success&&(V.value={full_name:a.data.data.full_name,role_name:a.data.data.role_name,toko:{id:a.data.data.toko.id,nama_toko:a.data.data.toko.nama_toko,alamat:a.data.data.toko.alamat}})}catch(a){console.error("Gagal mengambil data kasir:",a)}},X=async a=>{try{const e=await S.get(`${w}/pelanggan/${a}`,{headers:B()});e.data.success&&e.data.data&&(b.value=e.data.data.hutang||0)}catch(e){console.error("Gagal mengambil hutang pelanggan:",e),b.value=0}};ja(p,async a=>{a?await X(a):b.value=0});const ga=async()=>{F.value=!0;try{const a=await S.get(`${w}/pelanggan`,{headers:B()});a.data.success&&(U.value=a.data.data)}catch(a){console.error("Gagal mengambil data pelanggan:",a)}finally{F.value=!1}},ma=async a=>{if(g.value=-1,!a.trim()){m.value=[],C.value=!1;return}try{const e=await S.get(`${w}/produk`,{params:{search:a},headers:B()});e.data.success&&e.data.data.data&&(m.value=e.data.data.data.map(n=>({barcode:n.barcode,qty:1,nama_produk:n.nama_produk,harga_jual_biasa:parseFloat(n.harga_jual_biasa)})),C.value=!0)}catch(e){console.error("Error searching products:",e),m.value=[]}},Z=a=>{!C.value||m.value.length===0||(a==="down"?g.value<m.value.length-1?g.value++:g.value=0:a==="up"&&(g.value>0?g.value--:g.value=m.value.length-1))},ha=()=>{C.value&&g.value!==-1&&ta(m.value[g.value])},G=()=>{p.value="",h.value=0,i.value=[],R.value="",x.value=null,da(()=>{var a;(a=M.value)==null||a.focus()})},aa=(a,e)=>{const n=i.value.find(s=>s.barcode===a.barcode);n?(n.qty+=e,i.value=[n,...i.value.filter(s=>s.barcode!==a.barcode)]):i.value.unshift({barcode:a.barcode,qty:e,nama_produk:a.nama_produk,harga_jual_biasa:parseFloat(a.harga_jual_biasa)})},fa=a=>a===0?"":"Rp "+a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."),ba=a=>{const n=a.target.value.replace(/\D/g,"");h.value=n?parseInt(n):0},ya=()=>{var a;(a=W.value)==null||a.focus()},_a=async a=>{const{value:e,isConfirmed:n}=await c.fire({title:"Masukkan Jumlah",html:`Produk: <strong>${a.nama_produk}</strong><br>Harga: ${v(a.harga_jual_biasa)}`,input:"number",inputValue:1,inputAttributes:{min:"1",step:"1"},showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Masuk Keranjang",cancelButtonText:"Batal",didOpen:()=>{const s=c.getInput();s==null||s.focus(),s==null||s.select(),s==null||s.addEventListener("keydown",o=>{o.key==="Enter"&&(o.preventDefault(),c.clickConfirm())})}});if(n&&e){const s=parseInt(e);if(s>0)return aa(a,s),!0}return!1},ea=(a,e)=>{const n=i.value.find(s=>s.barcode===a);n&&(e<=0||isNaN(e)?O(a):n.qty=e)},O=a=>{i.value=i.value.filter(e=>e.barcode!==a)},ka=async a=>{try{const e=await S.post(`${w}/transaksi/scan`,{barcode:a},{headers:B()});return e.data.success&&e.data.data?e.data.data:null}catch(e){return console.error("Lookup product error:",e),null}},ta=async a=>{await _a(a)&&(N.value="",m.value=[],C.value=!1,g.value=-1)},wa=async()=>{const a=R.value.trim();if(!a)return;const e=await ka(a);if(e){try{ca.play()}catch(n){console.warn("Gagal memutar audio",n)}aa(e,1),c.fire({icon:"success",title:"Masuk Keranjang",text:`${e.nama_produk}`,timer:1e3,showConfirmButton:!1,toast:!0,position:"top-end"})}else c.fire({icon:"error",title:"Tidak Ditemukan",text:`Barcode: ${a}`,showConfirmButton:!1,timer:1500});R.value="",da(()=>{var n;(n=M.value)==null||n.focus()})},na=()=>{try{localStorage.setItem(ua,JSON.stringify(f.value))}catch(a){console.error("Error saving pending transactions:",a)}},xa=()=>{try{const a=localStorage.getItem(ua);f.value=a?JSON.parse(a):[]}catch(a){console.error("Error loading pending transactions:",a),f.value=[]}},Ca=async()=>{if(i.value.length===0){c.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!p.value){c.fire("Peringatan","Pilih pelanggan dahulu.","warning");return}const a=U.value.find(s=>s.id===p.value),e=a?a.nama_pelanggan:"Pelanggan",n={id:Date.now(),pelanggan_id:p.value,nama_pelanggan:e,items:[...i.value],tanggal_simpan:new Date().toLocaleString("id-ID"),total:$.value};f.value.push(n),na(),c.fire({title:"Tersimpan (Pending)",icon:"success",timer:1e3,showConfirmButton:!1,toast:!0,position:"top-end"}),G()},Ba=a=>{G(),p.value=a.pelanggan_id,i.value=a.items,h.value=0,x.value=a.id,J(x.value,!1)},J=(a,e=!0)=>{f.value=f.value.filter(n=>n.id!==a),na()},$a=(a,e,n,s,o,I)=>{const Y=a.total_bayar,z=a.total_harga,oa=a.total_kembalian,la=a.sisa_hutang,j=y=>new Intl.NumberFormat("id-ID",{minimumFractionDigits:0}).format(y);return`
        <div style="
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            width: 100%; 
            padding-left: 15px; 
            padding-right: 5px;
            color: #000;
        ">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 14px; margin-bottom: 5px;">${o.toUpperCase()}</div>
                <div style="font-size: 10px; line-height: 1.2;">
                    ${I.replace(/\n/g,"<br>")}
                </div>
            </div>

            <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0; margin: 5px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span>ID: ${a.id.substring(0,8)}</span>
                    <span>${pa(a.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 2px;">
                    <span>Kasir: ${s}</span>
                    <span>Plg: ${e}</span>
                </div>
            </div>

            <div style="border-bottom: 1px solid #000; padding-bottom: 5px;">
                ${n.map(y=>`
                    <div style="margin-top: 5px;">
                        <div style="text-align: left; font-size: 11px; margin-bottom: 2px;">
                            ${y.nama_produk}
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px;">
                            <span style="width: 30px; text-align: left;">${y.qty}x</span>
                            <span style="width: 70px; text-align: right;">${j(y.harga_jual_biasa)}</span>
                            <span style="flex: 1; text-align: right;">${j(y.qty*y.harga_jual_biasa)}</span>
                        </div>
                    </div>
                `).join("")}
            </div>

            <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px;">
                    <span>TOTAL:</span>
                    <span>Rp ${j(z)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                    <span>Tunai:</span>
                    <span>Rp ${j(Y)}</span>
                </div>
                ${oa>0?`
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span>Kembali:</span>
                        <span>Rp ${j(oa)}</span>
                    </div>
                `:""}
                ${la>0?`
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;">
                        <span>SISA HUTANG:</span>
                        <span>Rp ${j(la)}</span>
                    </div>
                `:""}
            </div>

            <div style="margin-top: 15px; font-size: 10px; text-align: center;">
                -- Terima Kasih --
            </div>
        </div>
    `},Pa=(a,e,n,s,o,I)=>{const Y=$a(a,e,n,s,o,I),z=window.open("","","width=400,height=600,scrollbars=yes");z&&(z.document.write(`
        <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: Arial, Helvetica, sans-serif; 
                        font-size: 11px;
                        background: #fff;
                    }

                    @media print {
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        body {
                            padding: 5px;
                            width: 100%;
                        }
                    }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 1000);">
                ${Y}
            </body>
        </html>
    `),z.document.close())},sa=async()=>{var n,s;if(!p.value){c.fire("Error","Pilih pelanggan.","error");return}if(i.value.length===0){c.fire("Error","Keranjang kosong.","error");return}if(P.value<0){if(!(await c.fire({title:"Kurang Bayar (Hutang)",text:`Kurang: ${v(Math.abs(P.value))}. Lanjut?`,icon:"warning",showCancelButton:!0,confirmButtonText:"Ya, Hutang"})).isConfirmed)return}else if(!(await c.fire({title:"Proses Transaksi?",html:`Total: <b>${v($.value)}</b><br>Bayar: <b>${v(h.value)}</b>`,icon:"question",showCancelButton:!0,confirmButtonText:"Ya",cancelButtonText:"Batal"})).isConfirmed)return;const a=[...i.value],e={pelanggan_id:p.value,pembayaran:h.value,items:i.value.map(o=>({barcode:o.barcode,qty:o.qty}))};q.value=!0;try{const o=await S.post(`${w}/transaksi/create/reguler`,e,{headers:B()});if(o.data.success){const I=o.data.data.transaksi;Pa(I,o.data.data.pelanggan.nama_pelanggan,a,V.value.full_name,V.value.toko.nama_toko,V.value.toko.alamat),c.fire({icon:"success",title:"Berhasil",text:`Kembalian: ${v(I.total_kembalian)}`,timer:2e3,showConfirmButton:!1}),x.value!==null&&J(x.value,!1),await X(p.value),G()}else c.fire("Gagal",o.data.message,"error")}catch(o){c.fire("Error",((s=(n=o.response)==null?void 0:n.data)==null?void 0:s.message)||"Server Error","error")}finally{q.value=!1}};return Ta(async()=>{var a;await va(),await ga(),xa(),(a=M.value)==null||a.focus()}),(a,e)=>(r(),Sa(za,null,{default:qa(()=>[t("div",Aa,[e[18]||(e[18]=t("div",{class:"header-section"},[t("p",{class:"page-title"}," Transaksi Penjualan Eceran ")],-1)),t("div",Da,[t("div",Ma,[t("div",Va,[K(t("input",{ref_key:"barcodeInputRef",ref:M,"onUpdate:modelValue":e[0]||(e[0]=n=>R.value=n),type:"text",placeholder:"Scan/ketik barcode...",onKeyup:T(wa,["enter"]),disabled:ra(Q)!=="admin",class:"input-field primary-border"},null,40,Na),[[H,R.value]])])]),t("div",Ha,[K(t("input",{"onUpdate:modelValue":e[1]||(e[1]=n=>N.value=n),type:"text",placeholder:"Cari nama produk (Panah Bawah utk pilih)...",onInput:e[2]||(e[2]=n=>ma(N.value)),onKeydown:[e[3]||(e[3]=T(_(n=>Z("down"),["prevent"]),["down"])),e[4]||(e[4]=T(_(n=>Z("up"),["prevent"]),["up"])),T(_(ha,["prevent"]),["enter"])],disabled:ra(Q)!=="admin",class:"input-field primary-border"},null,40,Ea),[[H,N.value]]),C.value&&m.value.length>0?(r(),d("div",La,[(r(!0),d(A,null,D(m.value,(n,s)=>(r(),d("div",{key:n.barcode,onClick:o=>ta(n),class:E(["px-3 py-2 cursor-pointer transition",s===g.value?"bg-blue-100 search-item-active":"search-item-default"])},[t("div",Fa,l(n.nama_produk),1),t("div",Ga,l(n.barcode)+" - "+l(v(n.harga_jual_biasa)),1)],10,Ua))),128))])):k("",!0)]),K(t("select",{"onUpdate:modelValue":e[5]||(e[5]=n=>p.value=n),required:"",class:"select-field",onKeydown:T(_(ya,["prevent"]),["enter"])},[e[6]||(e[6]=t("option",{value:"",disabled:""},"Pilih Pelanggan",-1)),F.value?(r(),d("option",Ja,"Memuat...")):k("",!0),(r(!0),d(A,null,D(U.value,n=>(r(),d("option",{key:n.id,value:n.id},l(n.nama_pelanggan),9,Ya))),128))],40,Oa),[[Ra,p.value]])]),p.value?(r(),d("div",Qa,[t("div",Wa,[e[7]||(e[7]=t("span",{class:"debt-label"},"Hutang Pelanggan",-1)),t("span",{class:E(["debt-value",b.value>0?"text-danger":"text-success"])},l(v(b.value)),3)])])):k("",!0),f.value.length>0?(r(),d("div",Xa,[t("p",Za,[e[8]||(e[8]=t("svg",{class:"icon-warning",fill:"currentColor",viewBox:"0 0 20 20"},[t("path",{"fill-rule":"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z","clip-rule":"evenodd"})],-1)),L(" Pending ("+l(f.value.length)+") ",1)]),t("div",ae,[(r(!0),d(A,null,D(f.value,n=>(r(),d("div",{key:n.id,class:E(["pending-card",{"active-pending":n.id===x.value}])},[t("div",null,[t("p",ee,l(n.nama_pelanggan),1),t("p",te,l(v(n.total)),1)]),t("div",ne,[t("button",{onClick:s=>Ba(n),class:"btn-xs btn-blue"}," Muat ",8,se),t("button",{onClick:s=>J(n.id),class:"btn-xs btn-red"}," Hapus ",8,oe)])],2))),128))])])):k("",!0),e[19]||(e[19]=t("hr",{class:"divider"},null,-1)),t("div",le,[t("div",ie,[i.value.length===0?(r(),d("div",re," Belum ada produk. ")):k("",!0),(r(!0),d(A,null,D(i.value,(n,s)=>(r(),d("div",{key:n.barcode,class:"mobile-item"},[t("div",de,[t("div",ue,l(s+1)+". "+l(n.nama_produk),1),t("button",{type:"button",onClick:o=>O(n.barcode),class:"btn-icon-red"},e[9]||(e[9]=[t("svg",{width:"16",height:"16",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,ce)]),t("div",pe,[t("div",ve,"Barcode: "+l(n.barcode),1),t("div",ge,l(v(n.harga_jual_biasa)),1)]),t("div",me,[t("div",he,[e[10]||(e[10]=t("span",{class:"qty-label"},"Qty:",-1)),K(t("input",{"onUpdate:modelValue":o=>n.qty=o,type:"number",min:"1",onChange:o=>ea(n.barcode,n.qty),class:"qty-input"},null,40,fe),[[H,n.qty,void 0,{number:!0}]])]),t("div",be,l(v(n.qty*n.harga_jual_biasa)),1)])]))),128))]),t("table",ye,[e[13]||(e[13]=t("thead",null,[t("tr",null,[t("th",{class:"th-no"},"No"),t("th",{class:"th-product"},"Produk"),t("th",{class:"th-qty"},"Qty"),t("th",{class:"th-price"},"Harga"),t("th",{class:"th-subtotal"},"Subtotal"),t("th",{class:"th-action"})])],-1)),t("tbody",null,[i.value.length===0?(r(),d("tr",_e,e[11]||(e[11]=[t("td",{colspan:"6",class:"empty-table"},"Belum ada produk.",-1)]))):k("",!0),(r(!0),d(A,null,D(i.value,(n,s)=>(r(),d("tr",{key:n.barcode},[t("td",null,l(s+1),1),t("td",null,[t("div",ke,l(n.nama_produk),1)]),t("td",we,[K(t("input",{"onUpdate:modelValue":o=>n.qty=o,type:"number",min:"1",onChange:o=>ea(n.barcode,n.qty),class:"table-qty-input"},null,40,xe),[[H,n.qty,void 0,{number:!0}]])]),t("td",Ce,l(v(n.harga_jual_biasa)),1),t("td",Be,l(v(n.qty*n.harga_jual_biasa)),1),t("td",$e,[t("button",{type:"button",onClick:o=>O(n.barcode),class:"btn-icon-red"},e[12]||(e[12]=[t("svg",{width:"14",height:"14",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,Pe)])]))),128))])]),t("div",Ie,[e[14]||(e[14]=t("span",null,"Total Belanja",-1)),t("span",je,l(v($.value)),1)])]),t("div",Te,[t("div",Se,[e[15]||(e[15]=t("label",{class:"input-label"},[L(" Jumlah Bayar "),t("span",{class:"text-danger"},"*")],-1)),t("input",{ref_key:"paymentInputRef",ref:W,value:fa(h.value),onInput:ba,onKeydown:T(_(sa,["prevent"]),["enter"]),type:"text",inputmode:"numeric",required:"",placeholder:"Rp 0",class:"payment-field"},null,40,qe)]),t("div",Re,[h.value>0?(r(),d("div",{key:0,class:E(["change-display",P.value>=0?"bg-success-light text-success-dark":"bg-danger-light text-danger-dark"])},[t("span",ze,l(P.value>=0?"Kembalian":"Kurang Bayar"),1),t("span",Ke,l(v(Math.abs(P.value))),1)],2)):(r(),d("div",Ae," Input pembayaran untuk lihat kembalian "))])]),t("div",De,[t("button",{type:"button",onClick:_(Ca,["prevent"]),disabled:i.value.length===0||!p.value,class:"btn-action btn-pending"},e[16]||(e[16]=[t("svg",{class:"icon-sm",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})],-1),L(" Simpan (Pending) ")]),8,Me),t("button",{type:"submit",onClick:_(sa,["prevent"]),disabled:q.value||$.value===0||!p.value||h.value<$.value&&P.value>=0,class:"btn-action btn-process"},[q.value?(r(),d("svg",Ne,e[17]||(e[17]=[t("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),t("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1)]))):k("",!0),L(" "+l(q.value?"Proses":"Proses Transaksi"),1)],8,Ve)])])]),_:1}))}}),Oe=Ka(He,[["__scopeId","data-v-8e5c60f5"]]);export{Oe as default};
