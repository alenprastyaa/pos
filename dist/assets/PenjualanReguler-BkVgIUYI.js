import{j as $a,r as u,c as oa,y as Pa,o as ja,b as i,a as Ia,w as Ta,d as t,p as z,v as H,B as E,u as la,x as M,e as r,F as A,h as D,q as k,z as Sa,n as L,t as o,f as U,A as ia}from"./index-DxYj3GZT.js";import{a as I,S as c}from"./sweetalert2.esm.all-BgBW3QO9.js";import{_ as qa}from"./AdminLayout-CGlUXVYQ.js";import{_ as Ra}from"./_plugin-vue_export-helper-DlAUqK2U.js";const za={class:"page-container"},Ma={class:"input-row"},Aa={class:"input-wrapper"},Da={class:"flex-row"},Ka=["disabled"],Va={class:"input-wrapper relative"},Na=["onKeydown","disabled"],Ha={key:0,class:"search-dropdown border rounded-md bg-white shadow-lg"},Ea=["onClick"],La={class:"font-semibold text-sm"},Ua={class:"text-xs text-gray-600"},Fa={key:0,disabled:""},Ga=["value"],Oa={key:0,class:"debt-card"},Ja={class:"debt-content"},Ya={key:1,class:"pending-section"},Wa={class:"pending-header"},Qa={class:"pending-grid"},Xa={class:"pending-customer"},Za={class:"pending-total"},ae={class:"pending-actions"},ee=["onClick"],te=["onClick"],ne={class:"table-container"},se={class:"mobile-list"},oe={key:0,class:"empty-state"},le={class:"mobile-item-header"},ie={class:"item-title"},re=["onClick"],de={class:"mobile-item-details"},ue={class:"item-barcode"},ce={class:"item-price"},pe={class:"mobile-item-footer"},ve={class:"qty-control"},ge=["onUpdate:modelValue","onChange"],me={class:"item-subtotal"},he={class:"desktop-table"},fe={key:0},be={class:"table-product-name"},_e={class:"td-center"},ye=["onUpdate:modelValue","onChange"],ke={class:"td-right table-price"},we={class:"td-right table-subtotal"},xe={class:"td-center"},Be=["onClick"],Ce={class:"table-footer"},$e={class:"total-amount"},Pe={class:"payment-row"},je={class:"payment-input-group"},Ie=["value"],Te={class:"payment-info-group"},Se={class:"change-label"},qe={class:"change-value"},Re={key:1,class:"change-placeholder"},ze={class:"action-row"},Me=["disabled"],Ae=["disabled"],De={key:0,class:"spinner",fill:"none",viewBox:"0 0 24 24"},ra="pendingTransactions",Ke=$a({__name:"PenjualanReguler",setup(Ve){const w="https://alentest.my.id/pos",_=u(0),W=localStorage.getItem("role_name"),da=new Audio("/barcode.mp3"),F=u([]),G=u(!1),T=u(!1),p=u(""),f=u(0),S=u(""),K=u(null),l=u([]),b=u([]),x=u(null),V=u(null),N=u(""),h=u([]),B=u(!1),m=u(-1),C=()=>({Authorization:`Bearer ${localStorage.getItem("authToken")}`}),$=oa(()=>l.value.reduce((a,e)=>a+e.qty*e.harga_jual_biasa,0)),q=oa(()=>{let a=f.value-$.value;return a>=0&&_.value>0&&(a=a-_.value),a}),v=a=>a==null||isNaN(a)?"Rp 0":new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(a),ua=a=>new Date(a).toLocaleDateString("id-ID",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),ca=async()=>{try{const a=await I.get(`${w}/user/my/data`,{headers:C()});a.data.success&&(V.value={full_name:a.data.data.full_name,role_name:a.data.data.role_name,toko:{id:a.data.data.toko.id,nama_toko:a.data.data.toko.nama_toko,alamat:a.data.data.toko.alamat}})}catch(a){console.error("Gagal mengambil data kasir:",a)}},Q=async a=>{try{const e=await I.get(`${w}/pelanggan/${a}`,{headers:C()});e.data.success&&e.data.data&&(_.value=e.data.data.hutang||0)}catch(e){console.error("Gagal mengambil hutang pelanggan:",e),_.value=0}};Pa(p,async a=>{a?await Q(a):_.value=0});const pa=async()=>{G.value=!0;try{const a=await I.get(`${w}/pelanggan`,{headers:C()});a.data.success&&(F.value=a.data.data)}catch(a){console.error("Gagal mengambil data pelanggan:",a)}finally{G.value=!1}},va=async a=>{if(m.value=-1,!a.trim()){h.value=[],B.value=!1;return}try{const e=await I.get(`${w}/produk`,{params:{search:a},headers:C()});e.data.success&&e.data.data.data&&(h.value=e.data.data.data.map(n=>({barcode:n.barcode,qty:1,nama_produk:n.nama_produk,harga_jual_biasa:parseFloat(n.harga_jual_biasa)})),B.value=!0)}catch(e){console.error("Error searching products:",e),h.value=[]}},X=a=>{!B.value||h.value.length===0||(a==="down"?m.value<h.value.length-1?m.value++:m.value=0:a==="up"&&(m.value>0?m.value--:m.value=h.value.length-1))},ga=()=>{B.value&&m.value!==-1&&ea(h.value[m.value])},O=()=>{p.value="",f.value=0,l.value=[],S.value="",x.value=null,ia(()=>{var a;(a=K.value)==null||a.focus()})},Z=(a,e)=>{const n=l.value.find(s=>s.barcode===a.barcode);n?(n.qty+=e,l.value=[n,...l.value.filter(s=>s.barcode!==a.barcode)]):l.value.unshift({barcode:a.barcode,qty:e,nama_produk:a.nama_produk,harga_jual_biasa:parseFloat(a.harga_jual_biasa)})},ma=a=>a===0?"":"Rp "+a.toString().replace(/\B(?=(\d{3})+(?!\d))/g,"."),ha=a=>{const n=a.target.value.replace(/\D/g,"");f.value=n?parseInt(n):0},fa=async a=>{const{value:e,isConfirmed:n}=await c.fire({title:"Masukkan Jumlah",html:`Produk: <strong>${a.nama_produk}</strong><br>Harga: ${v(a.harga_jual_biasa)}`,input:"number",inputValue:1,inputAttributes:{min:"1",step:"1"},showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Masuk Keranjang",cancelButtonText:"Batal",didOpen:()=>{const s=c.getInput();s==null||s.focus(),s==null||s.select(),s==null||s.addEventListener("keydown",d=>{d.key==="Enter"&&(d.preventDefault(),c.clickConfirm())})}});if(n&&e){const s=parseInt(e);if(s>0)return Z(a,s),!0}return!1},aa=(a,e)=>{const n=l.value.find(s=>s.barcode===a);n&&(e<=0||isNaN(e)?J(a):n.qty=e)},J=a=>{l.value=l.value.filter(e=>e.barcode!==a)},ba=async a=>{try{const e=await I.post(`${w}/transaksi/scan`,{barcode:a},{headers:C()});return e.data.success&&e.data.data?e.data.data:null}catch(e){return console.error("Lookup product error:",e),null}},ea=async a=>{await fa(a)&&(N.value="",h.value=[],B.value=!1,m.value=-1)},_a=async()=>{const a=S.value.trim();if(!a)return;const e=await ba(a);if(e){try{da.play()}catch(n){console.warn("Gagal memutar audio",n)}Z(e,1),c.fire({icon:"success",title:"Masuk Keranjang",text:`${e.nama_produk}`,timer:1e3,showConfirmButton:!1,toast:!0,position:"top-end"})}else c.fire({icon:"error",title:"Tidak Ditemukan",text:`Barcode: ${a}`,showConfirmButton:!1,timer:1500});S.value="",ia(()=>{var n;(n=K.value)==null||n.focus()})},ta=()=>{try{localStorage.setItem(ra,JSON.stringify(b.value))}catch(a){console.error("Error saving pending transactions:",a)}},ya=()=>{try{const a=localStorage.getItem(ra);b.value=a?JSON.parse(a):[]}catch(a){console.error("Error loading pending transactions:",a),b.value=[]}},ka=async()=>{if(l.value.length===0){c.fire("Peringatan","Keranjang belanja kosong.","warning");return}if(!p.value){c.fire("Peringatan","Pilih pelanggan dahulu.","warning");return}const a=F.value.find(s=>s.id===p.value),e=a?a.nama_pelanggan:"Pelanggan",n={id:Date.now(),pelanggan_id:p.value,nama_pelanggan:e,items:[...l.value],tanggal_simpan:new Date().toLocaleString("id-ID"),total:$.value};b.value.push(n),ta(),c.fire({title:"Tersimpan (Pending)",icon:"success",timer:1e3,showConfirmButton:!1,toast:!0,position:"top-end"}),O()},wa=a=>{O(),p.value=a.pelanggan_id,l.value=a.items,f.value=0,x.value=a.id,Y(x.value,!1)},Y=(a,e=!0)=>{b.value=b.value.filter(n=>n.id!==a),ta()},xa=(a,e,n,s,d,g)=>{const P=a.total_bayar,R=a.total_harga,na=a.total_kembalian,sa=a.sisa_hutang,j=y=>new Intl.NumberFormat("id-ID",{minimumFractionDigits:0}).format(y);return`
        <div style="
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            width: 100%; 
            padding-left: 15px; 
            padding-right: 5px;
            color: #000;
        ">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 14px; margin-bottom: 5px;">${d.toUpperCase()}</div>
                <div style="font-size: 10px; line-height: 1.2;">
                    ${g.replace(/\n/g,"<br>")}
                </div>
            </div>

            <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0; margin: 5px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span>ID: ${a.id.substring(0,8)}</span>
                    <span>${ua(a.createdAt)}</span>
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
                    <span>Rp ${j(R)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                    <span>Tunai:</span>
                    <span>Rp ${j(P)}</span>
                </div>
                ${na>0?`
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span>Kembali:</span>
                        <span>Rp ${j(na)}</span>
                    </div>
                `:""}
                ${sa>0?`
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;">
                        <span>SISA HUTANG:</span>
                        <span>Rp ${j(sa)}</span>
                    </div>
                `:""}
            </div>

            <div style="margin-top: 15px; font-size: 10px; text-align: center;">
                -- Terima Kasih --
            </div>
        </div>
    `},Ba=(a,e,n,s,d,g)=>{const P=xa(a,e,n,s,d,g),R=window.open("","","width=400,height=600,scrollbars=yes");R&&(R.document.write(`
        <html>
            <head>
                <style>
                    /* Reset Margin Browser */
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: Arial, Helvetica, sans-serif; 
                        font-size: 11px;
                        background: #fff;
                    }

                    /* Setting Wajib untuk Print */
                    @media print {
                        @page {
                            margin: 0; /* Menghilangkan header/footer browser */
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
                ${P}
            </body>
        </html>
    `),R.document.close())},Ca=async()=>{var s,d;if(!p.value){c.fire("Error","Pilih pelanggan.","error");return}if(l.value.length===0){c.fire("Error","Keranjang kosong.","error");return}if(!(await c.fire({title:"Proses Transaksi?",html:`Total: <b>${v($.value)}</b><br>Bayar: <b>${v(f.value)}</b>`,icon:"question",showCancelButton:!0,confirmButtonText:"Ya",cancelButtonText:"Batal"})).isConfirmed||q.value<0&&!(await c.fire({title:"Kurang Bayar (Hutang)",text:`Kurang: ${v(Math.abs(q.value))}. Lanjut?`,icon:"warning",showCancelButton:!0,confirmButtonText:"Ya, Hutang"})).isConfirmed)return;const e=[...l.value],n={pelanggan_id:p.value,pembayaran:f.value,items:l.value.map(g=>({barcode:g.barcode,qty:g.qty}))};T.value=!0;try{const g=await I.post(`${w}/transaksi/create/reguler`,n,{headers:C()});if(g.data.success){const P=g.data.data.transaksi;Ba(P,g.data.data.pelanggan.nama_pelanggan,e,V.value.full_name,V.value.toko.nama_toko,V.value.toko.alamat),c.fire({icon:"success",title:"Berhasil",text:`Kembalian: ${v(P.total_kembalian)}`,timer:2e3,showConfirmButton:!1}),x.value!==null&&Y(x.value,!1),await Q(p.value),O()}else c.fire("Gagal",g.data.message,"error")}catch(g){c.fire("Error",((d=(s=g.response)==null?void 0:s.data)==null?void 0:d.message)||"Server Error","error")}finally{T.value=!1}};return ja(async()=>{var a;await ca(),await pa(),ya(),(a=K.value)==null||a.focus()}),(a,e)=>(i(),Ia(qa,null,{default:Ta(()=>[t("div",za,[e[18]||(e[18]=t("div",{class:"header-section"},[t("p",{class:"page-title"}," Transaksi Penjualan Eceran ")],-1)),t("div",Ma,[t("div",Aa,[t("div",Da,[z(t("input",{ref_key:"barcodeInputRef",ref:K,"onUpdate:modelValue":e[0]||(e[0]=n=>S.value=n),type:"text",placeholder:"Scan/ketik barcode...",onKeyup:E(_a,["enter"]),disabled:la(W)!=="admin",class:"input-field primary-border"},null,40,Ka),[[H,S.value]])])]),t("div",Va,[z(t("input",{"onUpdate:modelValue":e[1]||(e[1]=n=>N.value=n),type:"text",placeholder:"Cari nama produk (Panah Bawah utk pilih)...",onInput:e[2]||(e[2]=n=>va(N.value)),onKeydown:[e[3]||(e[3]=E(M(n=>X("down"),["prevent"]),["down"])),e[4]||(e[4]=E(M(n=>X("up"),["prevent"]),["up"])),E(M(ga,["prevent"]),["enter"])],disabled:la(W)!=="admin",class:"input-field primary-border"},null,40,Na),[[H,N.value]]),B.value&&h.value.length>0?(i(),r("div",Ha,[(i(!0),r(A,null,D(h.value,(n,s)=>(i(),r("div",{key:n.barcode,onClick:d=>ea(n),class:L(["px-3 py-2 cursor-pointer transition",s===m.value?"bg-blue-100 search-item-active":"search-item-default"])},[t("div",La,o(n.nama_produk),1),t("div",Ua,o(n.barcode)+" - "+o(v(n.harga_jual_biasa)),1)],10,Ea))),128))])):k("",!0)]),z(t("select",{"onUpdate:modelValue":e[5]||(e[5]=n=>p.value=n),required:"",class:"select-field"},[e[6]||(e[6]=t("option",{value:"",disabled:""},"Pilih Pelanggan",-1)),G.value?(i(),r("option",Fa,"Memuat...")):k("",!0),(i(!0),r(A,null,D(F.value,n=>(i(),r("option",{key:n.id,value:n.id},o(n.nama_pelanggan),9,Ga))),128))],512),[[Sa,p.value]])]),p.value?(i(),r("div",Oa,[t("div",Ja,[e[7]||(e[7]=t("span",{class:"debt-label"},"Hutang Pelanggan",-1)),t("span",{class:L(["debt-value",_.value>0?"text-danger":"text-success"])},o(v(_.value)),3)])])):k("",!0),b.value.length>0?(i(),r("div",Ya,[t("p",Wa,[e[8]||(e[8]=t("svg",{class:"icon-warning",fill:"currentColor",viewBox:"0 0 20 20"},[t("path",{"fill-rule":"evenodd",d:"M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z","clip-rule":"evenodd"})],-1)),U(" Pending ("+o(b.value.length)+") ",1)]),t("div",Qa,[(i(!0),r(A,null,D(b.value,n=>(i(),r("div",{key:n.id,class:L(["pending-card",{"active-pending":n.id===x.value}])},[t("div",null,[t("p",Xa,o(n.nama_pelanggan),1),t("p",Za,o(v(n.total)),1)]),t("div",ae,[t("button",{onClick:s=>wa(n),class:"btn-xs btn-blue"}," Muat ",8,ee),t("button",{onClick:s=>Y(n.id),class:"btn-xs btn-red"}," Hapus ",8,te)])],2))),128))])])):k("",!0),e[19]||(e[19]=t("hr",{class:"divider"},null,-1)),t("div",ne,[t("div",se,[l.value.length===0?(i(),r("div",oe," Belum ada produk. ")):k("",!0),(i(!0),r(A,null,D(l.value,(n,s)=>(i(),r("div",{key:n.barcode,class:"mobile-item"},[t("div",le,[t("div",ie,o(s+1)+". "+o(n.nama_produk),1),t("button",{type:"button",onClick:d=>J(n.barcode),class:"btn-icon-red"},e[9]||(e[9]=[t("svg",{width:"16",height:"16",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,re)]),t("div",de,[t("div",ue,"Barcode: "+o(n.barcode),1),t("div",ce,o(v(n.harga_jual_biasa)),1)]),t("div",pe,[t("div",ve,[e[10]||(e[10]=t("span",{class:"qty-label"},"Qty:",-1)),z(t("input",{"onUpdate:modelValue":d=>n.qty=d,type:"number",min:"1",onChange:d=>aa(n.barcode,n.qty),class:"qty-input"},null,40,ge),[[H,n.qty,void 0,{number:!0}]])]),t("div",me,o(v(n.qty*n.harga_jual_biasa)),1)])]))),128))]),t("table",he,[e[13]||(e[13]=t("thead",null,[t("tr",null,[t("th",{class:"th-no"},"No"),t("th",{class:"th-product"},"Produk"),t("th",{class:"th-qty"},"Qty"),t("th",{class:"th-price"},"Harga"),t("th",{class:"th-subtotal"},"Subtotal"),t("th",{class:"th-action"})])],-1)),t("tbody",null,[l.value.length===0?(i(),r("tr",fe,e[11]||(e[11]=[t("td",{colspan:"6",class:"empty-table"},"Belum ada produk.",-1)]))):k("",!0),(i(!0),r(A,null,D(l.value,(n,s)=>(i(),r("tr",{key:n.barcode},[t("td",null,o(s+1),1),t("td",null,[t("div",be,o(n.nama_produk),1)]),t("td",_e,[z(t("input",{"onUpdate:modelValue":d=>n.qty=d,type:"number",min:"1",onChange:d=>aa(n.barcode,n.qty),class:"table-qty-input"},null,40,ye),[[H,n.qty,void 0,{number:!0}]])]),t("td",ke,o(v(n.harga_jual_biasa)),1),t("td",we,o(v(n.qty*n.harga_jual_biasa)),1),t("td",xe,[t("button",{type:"button",onClick:d=>J(n.barcode),class:"btn-icon-red"},e[12]||(e[12]=[t("svg",{width:"14",height:"14",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"})],-1)]),8,Be)])]))),128))])]),t("div",Ce,[e[14]||(e[14]=t("span",null,"Total Belanja",-1)),t("span",$e,o(v($.value)),1)])]),t("div",Pe,[t("div",je,[e[15]||(e[15]=t("label",{class:"input-label"},[U(" Jumlah Bayar "),t("span",{class:"text-danger"},"*")],-1)),t("input",{value:ma(f.value),onInput:ha,type:"text",inputmode:"numeric",required:"",placeholder:"Rp 0",class:"payment-field"},null,40,Ie)]),t("div",Te,[f.value>0?(i(),r("div",{key:0,class:L(["change-display",q.value>=0?"bg-success-light text-success-dark":"bg-danger-light text-danger-dark"])},[t("span",Se,o(q.value>=0?"Kembalian":"Kurang Bayar"),1),t("span",qe,o(v(Math.abs(q.value))),1)],2)):(i(),r("div",Re," Input pembayaran untuk lihat kembalian "))])]),t("div",ze,[t("button",{type:"button",onClick:M(ka,["prevent"]),disabled:l.value.length===0||!p.value,class:"btn-action btn-pending"},e[16]||(e[16]=[t("svg",{class:"icon-sm",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"})],-1),U(" Simpan (Pending) ")]),8,Me),t("button",{type:"submit",onClick:M(Ca,["prevent"]),disabled:T.value||$.value===0||!p.value||f.value<$.value,class:"btn-action btn-process"},[T.value?(i(),r("svg",De,e[17]||(e[17]=[t("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),t("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1)]))):k("",!0),U(" "+o(T.value?"Proses":"Proses Transaksi"),1)],8,Ae)])])]),_:1}))}}),Ue=Ra(Ke,[["__scopeId","data-v-f4557954"]]);export{Ue as default};
